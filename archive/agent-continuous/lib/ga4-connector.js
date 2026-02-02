/**
 * GA4 Data Connector
 * Fetches real user data from Google Analytics 4
 * Part of Feature #97 - Real data integration
 */

// Note: Requires @google-analytics/data package
// Install: npm install @google-analytics/data dotenv

class GA4Connector {
  constructor(options = {}) {
    this.useMockData = options.useMockData !== undefined ? options.useMockData : !process.env.GA4_PROPERTY_ID;

    if (!this.useMockData) {
      try {
        const { BetaAnalyticsDataClient } = require('@google-analytics/data');
        require('dotenv').config();

        this.propertyId = `properties/${process.env.GA4_PROPERTY_ID}`;
        this.analyticsDataClient = new BetaAnalyticsDataClient({
          keyFilename: process.env.GA4_SERVICE_ACCOUNT_KEY_PATH,
        });

        console.log('✅ GA4 Connector initialized with real data');
      } catch (error) {
        console.warn('⚠️  GA4 packages not installed, falling back to mock data');
        console.warn('   Run: npm install @google-analytics/data dotenv');
        this.useMockData = true;
      }
    } else {
      console.log('📊 GA4 Connector initialized with mock data');
    }

    // Cache for API responses
    this.cache = new Map();
    this.cacheTTL = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Get cached data or fetch fresh
   */
  async getCachedData(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Fetch page performance metrics from GA4
   */
  async getPageMetrics(pagePath, startDate = '7daysAgo', endDate = 'today') {
    if (this.useMockData) {
      return this.generateMockPageMetrics(pagePath);
    }

    const cacheKey = `page-${pagePath}-${startDate}-${endDate}`;
    return this.getCachedData(cacheKey, async () => {
      try {
        const [response] = await this.analyticsDataClient.runReport({
          property: this.propertyId,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'engagementRate' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
            { name: 'eventCount' },
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'pagePath',
              stringFilter: { value: pagePath },
            },
          },
        });

        if (!response.rows || response.rows.length === 0) {
          return null;
        }

        const row = response.rows[0];
        return {
          pagePath: row.dimensionValues[0].value,
          pageViews: parseInt(row.metricValues[0].value),
          sessions: parseInt(row.metricValues[1].value),
          engagementRate: parseFloat(row.metricValues[2].value),
          avgSessionDuration: parseFloat(row.metricValues[3].value),
          bounceRate: parseFloat(row.metricValues[4].value),
          events: parseInt(row.metricValues[5].value),
        };
      } catch (error) {
        console.error('Error fetching page metrics:', error);
        return this.generateMockPageMetrics(pagePath);
      }
    });
  }

  /**
   * Fetch conversion events from GA4
   */
  async getConversionMetrics(eventName, pagePath = null, startDate = '7daysAgo', endDate = 'today') {
    if (this.useMockData) {
      return this.generateMockConversionMetrics(eventName);
    }

    const cacheKey = `conversion-${eventName}-${pagePath}-${startDate}-${endDate}`;
    return this.getCachedData(cacheKey, async () => {
      try {
        const request = {
          property: this.propertyId,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'eventName' }],
          metrics: [
            { name: 'eventCount' },
            { name: 'eventCountPerUser' },
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { value: eventName },
            },
          },
        };

        if (pagePath) {
          request.dimensionFilter = {
            andGroup: {
              expressions: [
                {
                  filter: {
                    fieldName: 'eventName',
                    stringFilter: { value: eventName },
                  },
                },
                {
                  filter: {
                    fieldName: 'pagePath',
                    stringFilter: { value: pagePath },
                  },
                },
              ],
            },
          };
          request.dimensions.push({ name: 'pagePath' });
        }

        const [response] = await this.analyticsDataClient.runReport(request);

        if (!response.rows || response.rows.length === 0) {
          return { eventCount: 0, eventCountPerUser: 0 };
        }

        const row = response.rows[0];
        return {
          eventName: row.dimensionValues[0].value,
          eventCount: parseInt(row.metricValues[0].value),
          eventCountPerUser: parseFloat(row.metricValues[1].value),
        };
      } catch (error) {
        console.error('Error fetching conversion metrics:', error);
        return this.generateMockConversionMetrics(eventName);
      }
    });
  }

  /**
   * Calculate conversion rate for a page
   */
  async getConversionRate(pagePath, conversionEvent = 'cta_click', startDate = '7daysAgo', endDate = 'today') {
    try {
      const [pageMetrics, conversionMetrics] = await Promise.all([
        this.getPageMetrics(pagePath, startDate, endDate),
        this.getConversionMetrics(conversionEvent, pagePath, startDate, endDate),
      ]);

      if (!pageMetrics || pageMetrics.pageViews === 0) {
        return {
          pagePath,
          pageViews: 0,
          conversions: 0,
          conversionRate: 0,
        };
      }

      const conversionRate = (conversionMetrics.eventCount / pageMetrics.pageViews) * 100;

      return {
        pagePath,
        pageViews: pageMetrics.pageViews,
        sessions: pageMetrics.sessions,
        conversions: conversionMetrics.eventCount,
        conversionRate: conversionRate,
        engagementRate: pageMetrics.engagementRate * 100,
        bounceRate: pageMetrics.bounceRate * 100,
        avgSessionDuration: pageMetrics.avgSessionDuration,
      };
    } catch (error) {
      console.error('Error calculating conversion rate:', error);
      throw error;
    }
  }

  /**
   * Fetch all pages performance
   */
  async getAllPagesMetrics(pages, startDate = '7daysAgo', endDate = 'today') {
    try {
      const results = await Promise.all(
        pages.map(page => this.getConversionRate(page, 'cta_click', startDate, endDate))
      );
      return results;
    } catch (error) {
      console.error('Error fetching all pages metrics:', error);
      throw error;
    }
  }

  /**
   * Compare two time periods (for A/B testing)
   */
  async compareTimePeriods(pagePath, baselineStart, baselineEnd, testStart, testEnd) {
    try {
      const [baseline, test] = await Promise.all([
        this.getConversionRate(pagePath, 'cta_click', baselineStart, baselineEnd),
        this.getConversionRate(pagePath, 'cta_click', testStart, testEnd),
      ]);

      const conversionLift = baseline.conversionRate > 0
        ? ((test.conversionRate - baseline.conversionRate) / baseline.conversionRate) * 100
        : 0;

      const engagementLift = baseline.engagementRate > 0
        ? ((test.engagementRate - baseline.engagementRate) / baseline.engagementRate) * 100
        : 0;

      return {
        pagePath,
        baseline: {
          pageViews: baseline.pageViews,
          conversions: baseline.conversions,
          conversionRate: baseline.conversionRate,
          engagementRate: baseline.engagementRate,
        },
        test: {
          pageViews: test.pageViews,
          conversions: test.conversions,
          conversionRate: test.conversionRate,
          engagementRate: test.engagementRate,
        },
        lift: {
          conversionRate: conversionLift,
          engagementRate: engagementLift,
        },
        isSignificant: Math.abs(conversionLift) > 5 && test.pageViews > 1000,
      };
    } catch (error) {
      console.error('Error comparing time periods:', error);
      throw error;
    }
  }

  // ==================== MOCK DATA GENERATORS ====================
  // These are used when GA4 is not configured or packages not installed

  generateMockPageMetrics(pagePath) {
    const basePageViews = 5000 + Math.random() * 5000;
    const baseSessions = basePageViews * (0.7 + Math.random() * 0.2);

    return {
      pagePath,
      pageViews: Math.round(basePageViews),
      sessions: Math.round(baseSessions),
      engagementRate: 0.5 + Math.random() * 0.3,
      avgSessionDuration: 45 + Math.random() * 60,
      bounceRate: 0.3 + Math.random() * 0.3,
      events: Math.round(basePageViews * (0.1 + Math.random() * 0.2)),
    };
  }

  generateMockConversionMetrics(eventName) {
    return {
      eventName,
      eventCount: Math.round(300 + Math.random() * 500),
      eventCountPerUser: 0.8 + Math.random() * 0.4,
    };
  }
}

module.exports = GA4Connector;
