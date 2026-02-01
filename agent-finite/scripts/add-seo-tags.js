/**
 * SEO Tag Addition Script
 *
 * Adds comprehensive SEO meta tags, Open Graph, Twitter Cards, and JSON-LD
 * structured data to all Gemini Ads landing pages.
 *
 * Features:
 * - Meta tags for search engines
 * - Open Graph for Facebook/LinkedIn sharing
 * - Twitter Cards for Twitter sharing
 * - JSON-LD structured data for rich snippets
 * - Canonical URLs
 * - Robots meta tags
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const BASE_URL = 'https://wesleyzhao.github.io/gemini-ad';
const PAGES_DIR = path.join(__dirname, '../pages');
const BRAND = 'Gemini';
const BRAND_TAGLINE = 'Google AI for Everyone';

// Page-specific SEO data
const pageMetadata = {
  'apple-inspired.html': {
    title: 'Gemini - Intelligence Refined',
    description: 'Experience AI that thinks with you. Gemini brings Google\'s intelligence to your everyday tasks. Simple. Powerful. Refined.',
    keywords: 'gemini ai, google ai, artificial intelligence, minimalist ai, refined ai',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Technology',
    audience: 'General'
  },
  'bundling.html': {
    title: 'Gemini Everything - Your Complete AI Ecosystem',
    description: 'One AI. Infinite possibilities. Get Gemini across all your Google tools. Gmail + Docs + Drive + Calendar with AI superpowers.',
    keywords: 'gemini bundle, google workspace ai, ai ecosystem, productivity suite',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Business Professionals'
  },
  'business-intelligence.html': {
    title: 'Gemini for Business Intelligence - Data-Driven Decisions',
    description: 'Transform raw data into actionable insights. Gemini analyzes your business metrics and delivers executive-ready reports in seconds.',
    keywords: 'business intelligence, data analysis, ai analytics, business insights',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Business',
    audience: 'Business Leaders'
  },
  'creative-studio.html': {
    title: 'Gemini Creative Studio - Unleash Your Imagination',
    description: 'Your AI creative partner. From brainstorming to final draft, Gemini turns ideas into compelling content that captivates.',
    keywords: 'creative ai, content creation, brainstorming, ideation tools',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Creativity',
    audience: 'Creators'
  },
  'creators-voice-studio.html': {
    title: 'Gemini Voice Studio - AI That Sounds Like You',
    description: 'Create content that sounds authentically you. Gemini learns your voice, style, and tone to amplify your creative vision.',
    keywords: 'voice ai, content creation, creator tools, vo3, nano banana',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Content Creation',
    audience: 'Content Creators'
  },
  'developer-tools.html': {
    title: 'Gemini for Developers - Code Smarter, Ship Faster',
    description: 'Your AI pair programmer. Generate code, debug faster, write docs. Gemini understands your stack and accelerates development.',
    keywords: 'developer tools, code generation, ai programming, debugging',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Development',
    audience: 'Developers'
  },
  'education-learning.html': {
    title: 'Gemini for Learning - Your Personal AI Tutor',
    description: 'Learn anything, faster. Gemini adapts to your learning style with personalized explanations, practice problems, and study guides.',
    keywords: 'ai tutor, education, learning, study assistant',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Education',
    audience: 'Students'
  },
  'email-savior.html': {
    title: 'Gemini Email Savior - Inbox Zero, Achieved',
    description: 'Never drown in emails again. Gemini prioritizes, summarizes, and drafts replies so you can focus on what matters.',
    keywords: 'email management, inbox zero, gmail ai, email productivity',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Professionals'
  },
  'interactive-showcase.html': {
    title: 'Gemini Interactive Showcase - Experience AI in Action',
    description: 'See Gemini in action. Interactive demos showcase real use cases across writing, research, creativity, and productivity.',
    keywords: 'gemini demo, ai showcase, interactive ai, use cases',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Technology',
    audience: 'General'
  },
  'meeting-notes-magic.html': {
    title: 'Gemini Meeting Notes - Never Miss a Detail',
    description: 'Focus on the conversation, not note-taking. Gemini captures every detail, creates action items, and shares summaries automatically.',
    keywords: 'meeting notes, ai note-taking, meeting assistant, productivity',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Professionals'
  },
  'multimodal-ai.html': {
    title: 'Gemini Multimodal AI - See, Understand, Create',
    description: 'AI that sees what you see. Analyze images, understand documents, and process visual information with Google\'s advanced AI.',
    keywords: 'multimodal ai, image analysis, document processing, visual ai',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Technology',
    audience: 'General'
  },
  'operators-automators.html': {
    title: 'Gemini for Automation - Work Smarter, Not Harder',
    description: 'Automate the repetitive. Connect your tools, build workflows, and let Gemini handle the busy work while you focus on strategy.',
    keywords: 'workflow automation, productivity, automation tools, operators',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Operators'
  },
  'personal-assistant.html': {
    title: 'Gemini Personal Assistant - Your AI Chief of Staff',
    description: 'Manage your life with AI. Schedule meetings, draft emails, plan trips, and stay organized with your personal AI assistant.',
    keywords: 'personal assistant, ai assistant, productivity, task management',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Busy Professionals'
  },
  'pro.html': {
    title: 'Gemini Pro - Premium AI for Professionals',
    description: 'Unlock the full power of Google AI. Advanced features, priority access, and enterprise-grade capabilities for professionals.',
    keywords: 'gemini pro, premium ai, professional tools, advanced ai',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Professional',
    audience: 'Professionals'
  },
  'research-assistant.html': {
    title: 'Gemini Research Assistant - Deep Research, Fast Results',
    description: 'Research that cites its sources. Gemini dives deep into topics, verifies facts, and delivers comprehensive reports with citations.',
    keywords: 'research assistant, academic research, citations, fact checking',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Research',
    audience: 'Researchers'
  },
  'secret-weapon.html': {
    title: 'Gemini - Your Secret Weapon for Success',
    description: 'The AI advantage you\'ve been looking for. Gemini gives you superpowers in writing, research, creativity, and productivity.',
    keywords: 'ai productivity, success tools, competitive advantage, gemini ai',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Professionals'
  },
  'security-privacy.html': {
    title: 'Gemini Security & Privacy - Google-Grade Protection',
    description: 'Your data, your control. Enterprise-grade security, privacy-first design, and Google\'s trusted infrastructure protecting your information.',
    keywords: 'ai security, privacy, data protection, enterprise security',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Security',
    audience: 'Enterprise'
  },
  'think-different.html': {
    title: 'Gemini - Think Different with AI',
    description: 'AI that thinks differently. Break free from ordinary and discover new possibilities with Gemini\'s creative intelligence.',
    keywords: 'creative ai, innovation, thinking tools, gemini ai',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Innovation',
    audience: 'Innovators'
  },
  'trust-citations.html': {
    title: 'Gemini Trust & Citations - AI You Can Trust',
    description: 'AI that shows its work. Every answer backed by sources. No hallucinations, just verifiable facts with citations you can check.',
    keywords: 'ai citations, trustworthy ai, fact checking, source verification',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Trust',
    audience: 'Professionals'
  },
  'truth-matters.html': {
    title: 'Gemini - Where Truth Matters',
    description: 'In a world of AI hallucinations, Gemini delivers truth. Verified sources, accurate citations, and trustworthy information.',
    keywords: 'truthful ai, accurate ai, verified sources, no hallucinations',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Trust',
    audience: 'General'
  },
  'workspace-infinity.html': {
    title: 'Gemini Workspace Infinity - Unlimited Integration',
    description: 'Your entire workspace, AI-powered. Seamless integration across Gmail, Docs, Sheets, Calendar, Drive, and more.',
    keywords: 'google workspace, workspace integration, productivity suite, ai integration',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Business Users'
  },
  'workspace-integration.html': {
    title: 'Gemini + Google Workspace - Better Together',
    description: 'AI meets productivity. Gemini integrates seamlessly with Gmail, Docs, Calendar, and Drive to supercharge your workflow.',
    keywords: 'workspace integration, google workspace ai, productivity tools',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Business Users'
  },
  'writers-room.html': {
    title: 'Gemini Writers Room - Write Better, Faster',
    description: 'Your AI writing partner. From first draft to final polish, Gemini helps you craft compelling content that resonates.',
    keywords: 'ai writing, writing assistant, content creation, writers tools',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Writing',
    audience: 'Writers'
  },
  'love-letter-to-productivity.html': {
    title: 'Gemini - A Love Letter to Productivity',
    description: 'Fall in love with productivity. Gemini makes work feel effortless, turning tedious tasks into moments of joy.',
    keywords: 'productivity, valentine ai, work love, efficient tools',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Productivity',
    audience: 'Professionals'
  },
  'workflow-wizard.html': {
    title: 'Gemini Workflow Wizard - Automate Your Success',
    description: 'Magic happens when workflows flow. Gemini automates repetitive tasks and orchestrates your tools into perfect harmony.',
    keywords: 'workflow automation, productivity wizard, automation magic, workflow tools',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    category: 'Automation',
    audience: 'Operators'
  }
};

/**
 * Generate comprehensive SEO meta tags for a page
 */
function generateSEOTags(filename, metadata) {
  const url = `${BASE_URL}/pages/${filename}`;
  const imageUrl = `${BASE_URL}/assets/images/og-${filename.replace('.html', '')}.jpg`;

  return `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${metadata.title}">
    <meta name="description" content="${metadata.description}">
    <meta name="keywords" content="${metadata.keywords}">
    <meta name="author" content="Google">
    <meta name="robots" content="index, follow">
    <meta name="language" content="English">
    <meta name="revisit-after" content="7 days">

    <!-- Canonical URL -->
    <link rel="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${metadata.ogType}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:description" content="${metadata.description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:site_name" content="${BRAND}">
    <meta property="og:locale" content="en_US">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="${metadata.twitterCard}">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${metadata.title}">
    <meta name="twitter:description" content="${metadata.description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="@Google">
    <meta name="twitter:creator" content="@Google">

    <!-- Additional Meta Tags -->
    <meta name="theme-color" content="#4285f4">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="${BRAND}">
    <meta name="format-detection" content="telephone=no">
`;
}

/**
 * Generate JSON-LD structured data for a page
 */
function generateStructuredData(filename, metadata) {
  const url = `${BASE_URL}/pages/${filename}`;

  return `
    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${metadata.title}",
      "description": "${metadata.description}",
      "url": "${url}",
      "inLanguage": "en-US",
      "isPartOf": {
        "@type": "WebSite",
        "name": "${BRAND}",
        "url": "${BASE_URL}",
        "publisher": {
          "@type": "Organization",
          "name": "Google",
          "logo": {
            "@type": "ImageObject",
            "url": "${BASE_URL}/assets/images/gemini-logo.png"
          }
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${BASE_URL}"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "${metadata.title}",
            "item": "${url}"
          }
        ]
      },
      "about": {
        "@type": "SoftwareApplication",
        "name": "${BRAND}",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    }
    </script>
`;
}

/**
 * Add SEO tags to a single HTML file
 */
function addSEOToFile(filepath) {
  const filename = path.basename(filepath);
  const metadata = pageMetadata[filename];

  if (!metadata) {
    console.warn(`⚠️  No metadata found for ${filename}, skipping...`);
    return false;
  }

  try {
    // Read the HTML file
    const html = fs.readFileSync(filepath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const head = document.querySelector('head');

    if (!head) {
      console.error(`❌ No <head> found in ${filename}`);
      return false;
    }

    // Remove existing SEO meta tags (except viewport and charset)
    const metaTagsToRemove = head.querySelectorAll('meta:not([charset]):not([name="viewport"])');
    metaTagsToRemove.forEach(tag => tag.remove());

    // Remove existing canonical, og, twitter tags
    const tagsToRemove = head.querySelectorAll('link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]');
    tagsToRemove.forEach(tag => tag.remove());

    // Remove existing JSON-LD scripts
    const scriptsToRemove = head.querySelectorAll('script[type="application/ld+json"]');
    scriptsToRemove.forEach(script => script.remove());

    // Find the title tag
    const titleTag = head.querySelector('title');
    if (titleTag) {
      titleTag.textContent = metadata.title;
    }

    // Create a container for new SEO tags
    const seoContainer = document.createComment(' SEO Meta Tags ');
    const seoTags = generateSEOTags(filename, metadata);
    const structuredData = generateStructuredData(filename, metadata);

    // Insert after title or at beginning of head
    const insertPoint = titleTag ? titleTag.nextSibling : head.firstChild;

    // Create temporary container to parse HTML strings
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = seoTags + structuredData;

    // Insert each child node
    while (tempDiv.firstChild) {
      head.insertBefore(tempDiv.firstChild, insertPoint);
    }

    // Write back to file
    const updatedHTML = dom.serialize();
    fs.writeFileSync(filepath, updatedHTML, 'utf8');

    console.log(`✅ Added SEO tags to ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

/**
 * Process all HTML files in pages directory
 */
function processAllPages() {
  console.log('🚀 Starting SEO optimization for all landing pages...\n');

  const files = fs.readdirSync(PAGES_DIR)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(PAGES_DIR, file));

  let successCount = 0;
  let failCount = 0;

  files.forEach(filepath => {
    if (addSEOToFile(filepath)) {
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log('\n📊 SEO Optimization Summary:');
  console.log(`   Total files: ${files.length}`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  if (successCount === files.length) {
    console.log('\n🎉 All pages successfully optimized for SEO!');
  }
}

// Run the script
processAllPages();
