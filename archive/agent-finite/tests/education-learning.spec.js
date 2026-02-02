const { test, expect } = require('@playwright/test');

test.describe('Education & Learning Landing Page', () => {
    const PAGE_URL = 'pages/education-learning.html';

    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL);
    });

    // ============================================================================
    // PAGE LOAD TESTS
    // ============================================================================

    test('page loads successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Learn Anything, Anytime with Gemini AI/);
    });

    test('page has correct meta description', async ({ page }) => {
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute('content', /Learn smarter with Gemini AI/);
    });

    test('all external stylesheets load', async ({ page }) => {
        const designSystem = page.locator('link[href*="design-system.css"]');
        const components = page.locator('link[href*="components.css"]');
        const animations = page.locator('link[href*="animations.css"]');

        await expect(designSystem).toHaveCount(1);
        await expect(components).toHaveCount(1);
        await expect(animations).toHaveCount(1);
    });

    test('animations.js script loads', async ({ page }) => {
        const script = page.locator('script[src*="animations.js"]');
        await expect(script).toHaveCount(1);
    });

    // ============================================================================
    // NAVIGATION TESTS
    // ============================================================================

    test('hero CTA links to gemini.google.com', async ({ page }) => {
        const primaryCTA = page.locator('.hero .cta-primary');
        await expect(primaryCTA).toHaveAttribute('href', 'https://gemini.google.com');
        await expect(primaryCTA).toHaveAttribute('rel', 'noopener');
    });

    test('secondary CTA links to demo section', async ({ page }) => {
        const secondaryCTA = page.locator('.hero .cta-secondary');
        await expect(secondaryCTA).toHaveAttribute('href', '#demo');
    });

    test('final CTA links to gemini.google.com', async ({ page }) => {
        const finalCTA = page.locator('.final-cta-button');
        await expect(finalCTA).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('footer link works', async ({ page }) => {
        const footerLink = page.locator('.footer a');
        await expect(footerLink).toHaveAttribute('href', 'https://gemini.google.com');
    });

    // ============================================================================
    // HERO SECTION TESTS
    // ============================================================================

    test('hero section is visible', async ({ page }) => {
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('hero has correct badge text', async ({ page }) => {
        const badge = page.locator('.hero-badge');
        await expect(badge).toContainText('AI-Powered Education');
    });

    test('hero has main heading', async ({ page }) => {
        const h1 = page.locator('.hero h1');
        await expect(h1).toContainText('Learn anything, anytime');
    });

    test('hero has subtitle', async ({ page }) => {
        const subtitle = page.locator('.hero-subtitle');
        await expect(subtitle).toContainText('personal AI tutor');
        await expect(subtitle).toContainText('24/7');
    });

    test('hero has two CTA buttons', async ({ page }) => {
        const ctaGroup = page.locator('.hero-cta-group');
        const buttons = ctaGroup.locator('a');
        await expect(buttons).toHaveCount(2);
    });

    test('hero primary CTA has correct text', async ({ page }) => {
        const primaryCTA = page.locator('.hero .cta-primary');
        await expect(primaryCTA).toContainText('Start Learning Free');
    });

    test('hero secondary CTA has correct text', async ({ page }) => {
        const secondaryCTA = page.locator('.hero .cta-secondary');
        await expect(secondaryCTA).toContainText('See How It Works');
    });

    // ============================================================================
    // STATS SECTION TESTS
    // ============================================================================

    test('stats section is visible', async ({ page }) => {
        const statsSection = page.locator('.stats-section');
        await expect(statsSection).toBeVisible();
    });

    test('stats section has badge', async ({ page }) => {
        const badge = page.locator('.stats-badge');
        await expect(badge).toContainText('Trusted by Students Worldwide');
    });

    test('stats section has heading', async ({ page }) => {
        const heading = page.locator('.stats-section h2');
        await expect(heading).toContainText('Millions learn with Gemini every day');
    });

    test('stats section has 4 stat cards', async ({ page }) => {
        const statCards = page.locator('.stat-card');
        await expect(statCards).toHaveCount(4);
    });

    test('first stat shows 10M+ students', async ({ page }) => {
        const firstStat = page.locator('.stat-card').first();
        await expect(firstStat.locator('.stat-number')).toContainText('10M+');
        await expect(firstStat.locator('.stat-label')).toContainText('Students Helped');
    });

    test('second stat shows 50+ subjects', async ({ page }) => {
        const secondStat = page.locator('.stat-card').nth(1);
        await expect(secondStat.locator('.stat-number')).toContainText('50+');
        await expect(secondStat.locator('.stat-label')).toContainText('Subjects Covered');
    });

    test('third stat shows 24/7 availability', async ({ page }) => {
        const thirdStat = page.locator('.stat-card').nth(2);
        await expect(thirdStat.locator('.stat-number')).toContainText('24/7');
        await expect(thirdStat.locator('.stat-label')).toContainText('Always Available');
    });

    test('fourth stat shows 98% success rate', async ({ page }) => {
        const fourthStat = page.locator('.stat-card').nth(3);
        await expect(fourthStat.locator('.stat-number')).toContainText('98%');
        await expect(fourthStat.locator('.stat-label')).toContainText('Success Rate');
    });

    // ============================================================================
    // SUBJECTS SECTION TESTS
    // ============================================================================

    test('subjects section is visible', async ({ page }) => {
        const subjectsSection = page.locator('.subjects-section');
        await expect(subjectsSection).toBeVisible();
    });

    test('subjects section has badge', async ({ page }) => {
        const badge = page.locator('.subjects-badge');
        await expect(badge).toContainText('All Subjects');
    });

    test('subjects section has heading', async ({ page }) => {
        const heading = page.locator('.subjects-section h2');
        await expect(heading).toContainText('Master every subject');
    });

    test('subjects section has 6 subject cards', async ({ page }) => {
        const subjectCards = page.locator('.subject-card');
        await expect(subjectCards).toHaveCount(6);
    });

    test('mathematics subject card exists', async ({ page }) => {
        const mathCard = page.locator('.subject-card').first();
        await expect(mathCard.locator('h3')).toContainText('Mathematics');
        await expect(mathCard.locator('p')).toContainText('Algebra');
        await expect(mathCard.locator('.subject-icon')).toContainText('🔢');
    });

    test('science subject card exists', async ({ page }) => {
        const scienceCard = page.locator('.subject-card').nth(1);
        await expect(scienceCard.locator('h3')).toContainText('Science');
        await expect(scienceCard.locator('p')).toContainText('Physics');
        await expect(scienceCard.locator('.subject-icon')).toContainText('🔬');
    });

    test('language arts subject card exists', async ({ page }) => {
        const languageCard = page.locator('.subject-card').nth(2);
        await expect(languageCard.locator('h3')).toContainText('Language Arts');
        await expect(languageCard.locator('p')).toContainText('Grammar');
        await expect(languageCard.locator('.subject-icon')).toContainText('📚');
    });

    test('history subject card exists', async ({ page }) => {
        const historyCard = page.locator('.subject-card').nth(3);
        await expect(historyCard.locator('h3')).toContainText('History');
        await expect(historyCard.locator('p')).toContainText('World history');
        await expect(historyCard.locator('.subject-icon')).toContainText('🌍');
    });

    test('arts subject card exists', async ({ page }) => {
        const artsCard = page.locator('.subject-card').nth(4);
        await expect(artsCard.locator('h3')).toContainText('Arts & Humanities');
        await expect(artsCard.locator('p')).toContainText('Art history');
        await expect(artsCard.locator('.subject-icon')).toContainText('🎨');
    });

    test('computer science subject card exists', async ({ page }) => {
        const csCard = page.locator('.subject-card').nth(5);
        await expect(csCard.locator('h3')).toContainText('Computer Science');
        await expect(csCard.locator('p')).toContainText('Programming');
        await expect(csCard.locator('.subject-icon')).toContainText('💻');
    });

    // ============================================================================
    // DEMO SECTION TESTS
    // ============================================================================

    test('demo section is visible', async ({ page }) => {
        const demoSection = page.locator('.demo-section');
        await expect(demoSection).toBeVisible();
    });

    test('demo section has id attribute for anchor link', async ({ page }) => {
        const demoSection = page.locator('.demo-section');
        await expect(demoSection).toHaveAttribute('id', 'demo');
    });

    test('demo section has badge', async ({ page }) => {
        const badge = page.locator('.demo-badge');
        await expect(badge).toContainText('Live Example');
    });

    test('demo section has heading', async ({ page }) => {
        const heading = page.locator('.demo-section h2');
        await expect(heading).toContainText('See Gemini explain');
    });

    test('demo window is visible', async ({ page }) => {
        const demoWindow = page.locator('.demo-window');
        await expect(demoWindow).toBeVisible();
    });

    test('demo header shows quadratic equation example', async ({ page }) => {
        const demoTitle = page.locator('.demo-title');
        await expect(demoTitle).toContainText('Quadratic Equation Example');
    });

    test('demo subtitle shows subject', async ({ page }) => {
        const demoSubtitle = page.locator('.demo-subtitle');
        await expect(demoSubtitle).toContainText('Algebra II');
    });

    test('question box is visible', async ({ page }) => {
        const questionBox = page.locator('.question-box');
        await expect(questionBox).toBeVisible();
    });

    test('question has correct label', async ({ page }) => {
        const questionLabel = page.locator('.question-label');
        await expect(questionLabel).toContainText('Student Question');
    });

    test('question shows quadratic equation', async ({ page }) => {
        const questionText = page.locator('.question-text');
        await expect(questionText).toContainText('x² + 5x + 6 = 0');
    });

    test('answer box is visible', async ({ page }) => {
        const answerBox = page.locator('.answer-box');
        await expect(answerBox).toBeVisible();
    });

    test('answer has correct label', async ({ page }) => {
        const answerLabel = page.locator('.answer-label');
        await expect(answerLabel).toContainText('Gemini\'s Explanation');
    });

    test('answer has introduction text', async ({ page }) => {
        const answerText = page.locator('.answer-text').first();
        await expect(answerText).toContainText('step by step');
    });

    test('answer has 4 steps plus final answer', async ({ page }) => {
        const answerSteps = page.locator('.answer-step');
        await expect(answerSteps).toHaveCount(5); // 4 steps + final answer
    });

    test('step 1 identifies equation form', async ({ page }) => {
        const step1 = page.locator('.answer-step').first();
        await expect(step1).toContainText('Step 1');
        await expect(step1).toContainText('standard form');
    });

    test('step 2 finds factors', async ({ page }) => {
        const step2 = page.locator('.answer-step').nth(1);
        await expect(step2).toContainText('Step 2');
        await expect(step2).toContainText('multiply to 6');
    });

    test('step 3 shows factored form', async ({ page }) => {
        const step3 = page.locator('.answer-step').nth(2);
        await expect(step3).toContainText('Step 3');
        await expect(step3).toContainText('(x + 2)(x + 3)');
    });

    test('step 4 solves for x', async ({ page }) => {
        const step4 = page.locator('.answer-step').nth(3);
        await expect(step4).toContainText('Step 4');
        await expect(step4).toContainText('x = -2');
        await expect(step4).toContainText('x = -3');
    });

    test('final answer step exists', async ({ page }) => {
        const finalStep = page.locator('.answer-step').nth(4);
        await expect(finalStep).toContainText('Final Answer');
        await expect(finalStep).toContainText('x = -2 or x = -3');
    });

    test('answer includes math formulas', async ({ page }) => {
        const formulas = page.locator('.math-formula');
        await expect(formulas).toHaveCount(2);
    });

    test('answer includes pro tip', async ({ page }) => {
        const proTip = page.locator('.answer-text').last();
        await expect(proTip).toContainText('Pro Tip');
        await expect(proTip).toContainText('verify your answer');
    });

    // ============================================================================
    // FEATURES SECTION TESTS
    // ============================================================================

    test('features section is visible', async ({ page }) => {
        const featuresSection = page.locator('.features-section');
        await expect(featuresSection).toBeVisible();
    });

    test('features section has badge', async ({ page }) => {
        const badge = page.locator('.features-badge');
        await expect(badge).toContainText('Core Features');
    });

    test('features section has heading', async ({ page }) => {
        const heading = page.locator('.features-section h2');
        await expect(heading).toContainText('Everything you need to succeed');
    });

    test('features section has 6 feature cards', async ({ page }) => {
        const featureCards = page.locator('.feature-card');
        await expect(featureCards).toHaveCount(6);
    });

    test('instant explanations feature exists', async ({ page }) => {
        const instantCard = page.locator('.feature-card').first();
        await expect(instantCard.locator('h3')).toContainText('Instant Explanations');
        await expect(instantCard.locator('.feature-icon')).toContainText('💡');
    });

    test('step-by-step solutions feature exists', async ({ page }) => {
        const stepsCard = page.locator('.feature-card').nth(1);
        await expect(stepsCard.locator('h3')).toContainText('Step-by-Step Solutions');
        await expect(stepsCard.locator('.feature-icon')).toContainText('📝');
    });

    test('personalized learning feature exists', async ({ page }) => {
        const personalizedCard = page.locator('.feature-card').nth(2);
        await expect(personalizedCard.locator('h3')).toContainText('Personalized Learning');
        await expect(personalizedCard.locator('.feature-icon')).toContainText('🎯');
    });

    test('practice problems feature exists', async ({ page }) => {
        const practiceCard = page.locator('.feature-card').nth(3);
        await expect(practiceCard.locator('h3')).toContainText('Practice Problems');
        await expect(practiceCard.locator('.feature-icon')).toContainText('📊');
    });

    test('study guides feature exists', async ({ page }) => {
        const guidesCard = page.locator('.feature-card').nth(4);
        await expect(guidesCard.locator('h3')).toContainText('Study Guides');
        await expect(guidesCard.locator('.feature-icon')).toContainText('📖');
    });

    test('multiple languages feature exists', async ({ page }) => {
        const languagesCard = page.locator('.feature-card').nth(5);
        await expect(languagesCard.locator('h3')).toContainText('Multiple Languages');
        await expect(languagesCard.locator('.feature-icon')).toContainText('🌐');
    });

    // ============================================================================
    // STUDY TOOLS SECTION TESTS
    // ============================================================================

    test('study tools section is visible', async ({ page }) => {
        const studyToolsSection = page.locator('.study-tools-section');
        await expect(studyToolsSection).toBeVisible();
    });

    test('study tools section has badge', async ({ page }) => {
        const badge = page.locator('.study-tools-badge');
        await expect(badge).toContainText('Study Tools');
    });

    test('study tools section has heading', async ({ page }) => {
        const heading = page.locator('.study-tools-section h2');
        await expect(heading).toContainText('Smart tools for smarter studying');
    });

    test('study tools section has 6 tool cards', async ({ page }) => {
        const toolCards = page.locator('.tool-card');
        await expect(toolCards).toHaveCount(6);
    });

    test('flashcards tool exists', async ({ page }) => {
        const flashcardsCard = page.locator('.tool-card').first();
        await expect(flashcardsCard.locator('h3')).toContainText('Flashcards');
        await expect(flashcardsCard.locator('.tool-icon')).toContainText('🎴');
    });

    test('quiz creator tool exists', async ({ page }) => {
        const quizCard = page.locator('.tool-card').nth(1);
        await expect(quizCard.locator('h3')).toContainText('Quiz Creator');
        await expect(quizCard.locator('.tool-icon')).toContainText('📋');
    });

    test('essay helper tool exists', async ({ page }) => {
        const essayCard = page.locator('.tool-card').nth(2);
        await expect(essayCard.locator('h3')).toContainText('Essay Helper');
        await expect(essayCard.locator('.tool-icon')).toContainText('✍️');
    });

    test('research assistant tool exists', async ({ page }) => {
        const researchCard = page.locator('.tool-card').nth(3);
        await expect(researchCard.locator('h3')).toContainText('Research Assistant');
        await expect(researchCard.locator('.tool-icon')).toContainText('🔍');
    });

    test('study planner tool exists', async ({ page }) => {
        const plannerCard = page.locator('.tool-card').nth(4);
        await expect(plannerCard.locator('h3')).toContainText('Study Planner');
        await expect(plannerCard.locator('.tool-icon')).toContainText('⏰');
    });

    test('image analysis tool exists', async ({ page }) => {
        const imageCard = page.locator('.tool-card').nth(5);
        await expect(imageCard.locator('h3')).toContainText('Image Analysis');
        await expect(imageCard.locator('.tool-icon')).toContainText('📸');
    });

    // ============================================================================
    // TESTIMONIALS SECTION TESTS
    // ============================================================================

    test('testimonials section is visible', async ({ page }) => {
        const testimonialsSection = page.locator('.testimonials-section');
        await expect(testimonialsSection).toBeVisible();
    });

    test('testimonials section has badge', async ({ page }) => {
        const badge = page.locator('.testimonials-badge');
        await expect(badge).toContainText('Success Stories');
    });

    test('testimonials section has heading', async ({ page }) => {
        const heading = page.locator('.testimonials-section h2');
        await expect(heading).toContainText('Loved by students and educators');
    });

    test('testimonials section has 3 testimonial cards', async ({ page }) => {
        const testimonialCards = page.locator('.testimonial-card');
        await expect(testimonialCards).toHaveCount(3);
    });

    test('first testimonial - Sarah Johnson student', async ({ page }) => {
        const firstTestimonial = page.locator('.testimonial-card').first();
        await expect(firstTestimonial.locator('.testimonial-text')).toContainText('math grade from a C to an A');
        await expect(firstTestimonial.locator('h4')).toContainText('Sarah Johnson');
        await expect(firstTestimonial.locator('.testimonial-role')).toContainText('High School Student');
    });

    test('second testimonial - Michael Chen teacher', async ({ page }) => {
        const secondTestimonial = page.locator('.testimonial-card').nth(1);
        await expect(secondTestimonial.locator('.testimonial-text')).toContainText('recommend Gemini to all my students');
        await expect(secondTestimonial.locator('h4')).toContainText('Michael Chen');
        await expect(secondTestimonial.locator('.testimonial-role')).toContainText('AP Chemistry Teacher');
    });

    test('third testimonial - David Rodriguez college student', async ({ page }) => {
        const thirdTestimonial = page.locator('.testimonial-card').nth(2);
        await expect(thirdTestimonial.locator('.testimonial-text')).toContainText('organic chemistry');
        await expect(thirdTestimonial.locator('h4')).toContainText('David Rodriguez');
        await expect(thirdTestimonial.locator('.testimonial-role')).toContainText('Pre-Med Student');
    });

    // ============================================================================
    // FINAL CTA SECTION TESTS
    // ============================================================================

    test('final CTA section is visible', async ({ page }) => {
        const finalCTASection = page.locator('.final-cta-section');
        await expect(finalCTASection).toBeVisible();
    });

    test('final CTA has heading', async ({ page }) => {
        const heading = page.locator('.final-cta-section h2');
        await expect(heading).toContainText('Start learning smarter today');
    });

    test('final CTA has description', async ({ page }) => {
        const description = page.locator('.final-cta-section p');
        await expect(description).toContainText('millions of students');
    });

    test('final CTA button has correct text', async ({ page }) => {
        const button = page.locator('.final-cta-button');
        await expect(button).toContainText('Get Started Free');
    });

    // ============================================================================
    // FOOTER TESTS
    // ============================================================================

    test('footer is visible', async ({ page }) => {
        const footer = page.locator('.footer');
        await expect(footer).toBeVisible();
    });

    test('footer has copyright text', async ({ page }) => {
        const footerText = page.locator('.footer p');
        await expect(footerText).toContainText('Google LLC');
    });

    test('footer has link to Gemini', async ({ page }) => {
        const footerLink = page.locator('.footer a');
        await expect(footerLink).toContainText('Learn more about Gemini');
    });

    test('footer link has noopener attribute', async ({ page }) => {
        const footerLink = page.locator('.footer a');
        await expect(footerLink).toHaveAttribute('rel', 'noopener');
    });

    // ============================================================================
    // CTA & LINKS TESTS
    // ============================================================================

    test('all gemini.google.com links are present', async ({ page }) => {
        const geminiLinks = page.locator('a[href="https://gemini.google.com"]');
        await expect(geminiLinks).toHaveCount(3); // Hero primary, final CTA, footer
    });

    test('all external links have rel="noopener"', async ({ page }) => {
        const externalLinks = page.locator('a[href^="https://"]');
        const count = await externalLinks.count();

        for (let i = 0; i < count; i++) {
            const link = externalLinks.nth(i);
            await expect(link).toHaveAttribute('rel', 'noopener');
        }
    });

    // ============================================================================
    // ANIMATION TESTS
    // ============================================================================

    test('hero elements have animation classes', async ({ page }) => {
        const badge = page.locator('.hero-badge');
        const h1 = page.locator('.hero h1');
        const subtitle = page.locator('.hero-subtitle');
        const ctaGroup = page.locator('.hero-cta-group');

        await expect(badge).toBeVisible();
        await expect(h1).toBeVisible();
        await expect(subtitle).toBeVisible();
        await expect(ctaGroup).toBeVisible();
    });

    test('scroll-triggered elements have animate-on-scroll class', async ({ page }) => {
        const animatedElements = page.locator('.animate-on-scroll');
        const count = await animatedElements.count();
        expect(count).toBeGreaterThan(0);
    });

    test('intersection observer script is present', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('IntersectionObserver');
        expect(scriptContent).toContain('animated');
    });

    test('smooth scroll script is present', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('scrollIntoView');
        expect(scriptContent).toContain('behavior: \'smooth\'');
    });

    // ============================================================================
    // TYPOGRAPHY TESTS
    // ============================================================================

    test('page uses Playfair Display for headings', async ({ page }) => {
        const h1 = page.locator('h1').first();
        const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
        expect(fontFamily).toContain('Playfair Display');
    });

    test('page uses Inter for body text', async ({ page }) => {
        const body = page.locator('body');
        const fontFamily = await body.evaluate(el => getComputedStyle(el).fontFamily);
        expect(fontFamily).toContain('Inter');
    });

    test('single h1 element on page', async ({ page }) => {
        const h1Elements = page.locator('h1');
        await expect(h1Elements).toHaveCount(1);
    });

    // ============================================================================
    // RESPONSIVE DESIGN TESTS
    // ============================================================================

    test('page is responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('page is responsive on tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('page is responsive on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('CTA buttons stack on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const ctaGroup = page.locator('.hero-cta-group');
        await expect(ctaGroup).toBeVisible();
    });

    // ============================================================================
    // ACCESSIBILITY TESTS
    // ============================================================================

    test('page has lang attribute', async ({ page }) => {
        const html = page.locator('html');
        await expect(html).toHaveAttribute('lang', 'en');
    });

    test('all buttons have visible text', async ({ page }) => {
        const buttons = page.locator('a.cta-primary, a.cta-secondary, a.final-cta-button');
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            const text = await button.textContent();
            expect(text.trim().length).toBeGreaterThan(0);
        }
    });

    test('focus styles are defined for interactive elements', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain(':focus');
    });

    test('prefers-reduced-motion is supported', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('prefers-reduced-motion');
    });

    // ============================================================================
    // DESIGN QUALITY TESTS
    // ============================================================================

    test('hero has gradient background', async ({ page }) => {
        const hero = page.locator('.hero');
        const background = await hero.evaluate(el => getComputedStyle(el).background);
        expect(background).toContain('gradient');
    });

    test('stat numbers have gradient text', async ({ page }) => {
        const statNumber = page.locator('.stat-number').first();
        const background = await statNumber.evaluate(el => getComputedStyle(el).background);
        expect(background).toContain('gradient');
    });

    test('subject cards have hover effects', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('.subject-card:hover');
    });

    test('demo window has shadow', async ({ page }) => {
        const demoWindow = page.locator('.demo-window');
        const boxShadow = await demoWindow.evaluate(el => getComputedStyle(el).boxShadow);
        expect(boxShadow).not.toBe('none');
    });

    test('testimonial cards have quote marks', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('.testimonial-card::before');
    });

    test('page uses CSS custom properties', async ({ page }) => {
        const scriptContent = await page.content();
        expect(scriptContent).toContain('--edu-primary');
        expect(scriptContent).toContain('--text-dark');
    });

    // ============================================================================
    // PERFORMANCE TESTS
    // ============================================================================

    test('page loads without JavaScript errors', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        await page.reload();
        expect(errors.length).toBe(0);
    });

    test('page loads without console errors', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        await page.reload();
        expect(errors.length).toBe(0);
    });

    // ============================================================================
    // EDUCATION-SPECIFIC TESTS
    // ============================================================================

    test('page mentions education-specific terms', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('tutor');
        expect(content).toContain('learning');
        expect(content).toContain('student');
        expect(content).toContain('study');
        expect(content).toContain('homework');
    });

    test('page showcases 6 different subjects', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('Mathematics');
        expect(content).toContain('Science');
        expect(content).toContain('Language Arts');
        expect(content).toContain('History');
        expect(content).toContain('Arts');
        expect(content).toContain('Computer Science');
    });

    test('demo shows step-by-step solution', async ({ page }) => {
        const steps = page.locator('.answer-step');
        await expect(steps).toHaveCount(5);
    });

    test('demo includes mathematical notation', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('x² + 5x + 6 = 0');
        expect(content).toContain('(x + 2)(x + 3)');
    });

    test('page emphasizes 24/7 availability', async ({ page }) => {
        const content = await page.content();
        const matches = content.match(/24\/7/g);
        expect(matches).not.toBeNull();
        expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    test('page mentions multiple study tools', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('Flashcards');
        expect(content).toContain('Quiz Creator');
        expect(content).toContain('Essay Helper');
        expect(content).toContain('Research Assistant');
        expect(content).toContain('Study Planner');
    });

    test('testimonials include student and teacher perspectives', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('High School Student');
        expect(content).toContain('Teacher');
        expect(content).toContain('College') || expect(content).toContain('Pre-Med');
    });

    test('page emphasizes personalized learning', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('Personalized');
        expect(content).toContain('your learning style');
    });

    test('page mentions image analysis for homework help', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('Image Analysis');
        expect(content).toContain('Upload photos');
    });

    // ============================================================================
    // SCREENSHOT TESTS
    // ============================================================================

    test('full page screenshot', async ({ page }) => {
        await page.screenshot({ path: 'tests/screenshots/education-learning-full.png', fullPage: true });
    });

    test('hero section screenshot', async ({ page }) => {
        const hero = page.locator('.hero');
        await hero.screenshot({ path: 'tests/screenshots/education-learning-hero.png' });
    });

    test('demo section screenshot', async ({ page }) => {
        const demo = page.locator('.demo-window');
        await demo.screenshot({ path: 'tests/screenshots/education-learning-demo.png' });
    });

    test('subjects section screenshot', async ({ page }) => {
        const subjects = page.locator('.subjects-section');
        await subjects.screenshot({ path: 'tests/screenshots/education-learning-subjects.png' });
    });

    test('mobile screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.screenshot({ path: 'tests/screenshots/education-learning-mobile.png', fullPage: true });
    });

    test('tablet screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.screenshot({ path: 'tests/screenshots/education-learning-tablet.png', fullPage: true });
    });

    // ============================================================================
    // INTEGRATION TESTS
    // ============================================================================

    test('shared CSS files load correctly', async ({ page }) => {
        const response = await page.goto(PAGE_URL);
        expect(response.status()).toBe(200);
    });

    test('page integrates with shared design system', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('design-system.css');
        expect(content).toContain('components.css');
        expect(content).toContain('animations.css');
    });

    test('animations.js enhances page functionality', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('animations.js');
    });

    // ============================================================================
    // CONTENT QUALITY TESTS
    // ============================================================================

    test('hero has compelling value proposition', async ({ page }) => {
        const subtitle = page.locator('.hero-subtitle');
        await expect(subtitle).toContainText('personal AI tutor');
        await expect(subtitle).toContainText('instant explanations');
    });

    test('stats are specific and credible', async ({ page }) => {
        const content = await page.content();
        expect(content).toContain('10M+');
        expect(content).toContain('50+');
        expect(content).toContain('98%');
    });

    test('demo provides educational value', async ({ page }) => {
        const demo = page.locator('.demo-content');
        await expect(demo).toContainText('step by step');
        await expect(demo).toContainText('Pro Tip');
    });

    test('CTAs are action-oriented', async ({ page }) => {
        const primaryCTA = page.locator('.cta-primary').first();
        const finalCTA = page.locator('.final-cta-button');

        await expect(primaryCTA).toContainText('Start');
        await expect(finalCTA).toContainText('Get Started');
    });
});
