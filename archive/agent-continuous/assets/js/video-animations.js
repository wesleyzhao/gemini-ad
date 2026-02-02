/**
 * Gemini Ad Campaign - Video & Advanced Animation Utilities
 * Apple.com-inspired canvas animations, video controls, and visual effects
 */

// ============================================
// CANVAS IMAGE SEQUENCE ANIMATION
// ============================================

/**
 * Apple-style scroll-driven image sequence animation
 * Plays through a sequence of images based on scroll position
 *
 * Usage:
 * <canvas id="scroll-sequence"
 *         data-frame-count="150"
 *         data-frame-path="assets/images/sequence/frame-{index}.jpg"
 *         data-frame-start="1"
 *         width="1920"
 *         height="1080">
 * </canvas>
 */
class CanvasSequence {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');

        // Configuration
        this.frameCount = parseInt(canvasElement.dataset.frameCount) || options.frameCount || 150;
        this.framePath = canvasElement.dataset.framePath || options.framePath || 'frame-{index}.jpg';
        this.frameStart = parseInt(canvasElement.dataset.frameStart) || options.frameStart || 0;
        this.scrollStart = options.scrollStart || 0; // Scroll position to start (0-1)
        this.scrollEnd = options.scrollEnd || 1; // Scroll position to end (0-1)

        // State
        this.images = [];
        this.currentFrame = 0;
        this.isLoaded = false;
        this.isPlaying = false;

        // Resize canvas to fit container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Preload images
        this.preloadImages();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Redraw current frame
        if (this.isLoaded && this.images[this.currentFrame]) {
            this.drawFrame(this.currentFrame);
        }
    }

    preloadImages() {
        const loadPromises = [];

        for (let i = 0; i < this.frameCount; i++) {
            const img = new Image();
            const frameNumber = this.frameStart + i;
            const paddedNumber = String(frameNumber).padStart(4, '0');
            img.src = this.framePath.replace('{index}', paddedNumber);

            loadPromises.push(
                new Promise((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.warn(`Failed to load frame ${frameNumber}`);
                        resolve(null); // Continue even if one frame fails
                    };
                })
            );

            this.images.push(img);
        }

        // Wait for all images to load
        Promise.all(loadPromises).then(() => {
            this.isLoaded = true;
            this.drawFrame(0); // Draw first frame
            this.startScrollAnimation();
        });
    }

    drawFrame(frameIndex) {
        const img = this.images[frameIndex];
        if (!img || !img.complete) return;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate dimensions to cover canvas while maintaining aspect ratio
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = img.width / img.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imageAspect > canvasAspect) {
            // Image is wider
            drawHeight = this.canvas.height;
            drawWidth = img.width * (drawHeight / img.height);
            drawX = (this.canvas.width - drawWidth) / 2;
            drawY = 0;
        } else {
            // Image is taller
            drawWidth = this.canvas.width;
            drawHeight = img.height * (drawWidth / img.width);
            drawX = 0;
            drawY = (this.canvas.height - drawHeight) / 2;
        }

        this.context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    startScrollAnimation() {
        let ticking = false;

        const updateFrame = () => {
            if (!this.isLoaded) return;

            // Calculate scroll progress
            const scrollTop = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

            // Map scroll to frame range
            const effectiveScroll = (scrollFraction - this.scrollStart) / (this.scrollEnd - this.scrollStart);
            const clampedScroll = Math.min(Math.max(effectiveScroll, 0), 1);

            // Calculate frame index
            const frameIndex = Math.min(
                this.frameCount - 1,
                Math.floor(clampedScroll * this.frameCount)
            );

            // Only redraw if frame changed
            if (frameIndex !== this.currentFrame) {
                this.currentFrame = frameIndex;
                this.drawFrame(frameIndex);
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateFrame);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        updateFrame(); // Initial draw
    }

    // Play sequence as animation (not scroll-driven)
    play(fps = 30, loop = false) {
        if (this.isPlaying) return;

        this.isPlaying = true;
        let frame = 0;
        const interval = 1000 / fps;

        const animate = () => {
            if (!this.isPlaying) return;

            this.drawFrame(frame);
            frame++;

            if (frame >= this.frameCount) {
                if (loop) {
                    frame = 0;
                } else {
                    this.isPlaying = false;
                    return;
                }
            }

            setTimeout(() => requestAnimationFrame(animate), interval);
        };

        animate();
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.currentFrame = 0;
        this.drawFrame(0);
    }
}

// ============================================
// ENHANCED VIDEO PLAYER
// ============================================

/**
 * Enhanced video player with Apple-style controls
 * Supports autoplay, loop, scroll-based playback
 *
 * Usage:
 * <video class="apple-video"
 *        data-autoplay="true"
 *        data-loop="true"
 *        data-scroll-play="true"
 *        muted playsinline>
 *   <source src="video.mp4" type="video/mp4">
 *   <source src="video.webm" type="video/webm">
 * </video>
 */
class VideoPlayer {
    constructor(videoElement) {
        this.video = videoElement;
        this.autoplay = videoElement.dataset.autoplay === 'true';
        this.loop = videoElement.dataset.loop === 'true';
        this.scrollPlay = videoElement.dataset.scrollPlay === 'true';

        this.init();
    }

    init() {
        // Setup video attributes
        if (this.loop) {
            this.video.loop = true;
        }

        // Autoplay when in viewport
        if (this.autoplay) {
            this.setupAutoplay();
        }

        // Scroll-based playback
        if (this.scrollPlay) {
            this.setupScrollPlay();
        }

        // Add loading state
        this.video.addEventListener('loadeddata', () => {
            this.video.classList.add('loaded');
        });

        // Error handling
        this.video.addEventListener('error', () => {
            console.error('Video failed to load:', this.video.src);
            this.video.classList.add('error');
        });
    }

    setupAutoplay() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.play();
                } else {
                    this.pause();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.video);
    }

    setupScrollPlay() {
        // Play video based on scroll position
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.syncToScroll();
                }
            });
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

        observer.observe(this.video);
    }

    syncToScroll() {
        let ticking = false;

        const updateVideoTime = () => {
            const rect = this.video.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how far through the viewport the video is
            const scrollProgress = 1 - ((rect.top + rect.height) / (viewportHeight + rect.height));
            const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

            // Set video time based on scroll
            this.video.currentTime = this.video.duration * clampedProgress;

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateVideoTime);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    play() {
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video play prevented:', error);
            });
        }
    }

    pause() {
        this.video.pause();
    }
}

// ============================================
// ANIMATED SVG ICONS
// ============================================

/**
 * Animate SVG paths on scroll/hover
 * Creates smooth drawing animations
 */
class SVGAnimator {
    constructor(svgElement) {
        this.svg = svgElement;
        this.paths = this.svg.querySelectorAll('path, circle, rect, line, polyline, polygon');
        this.isAnimated = false;

        this.init();
    }

    init() {
        // Calculate and set stroke dash properties
        this.paths.forEach(path => {
            const length = path.getTotalLength ? path.getTotalLength() : 0;
            if (length) {
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            }
        });

        // Trigger animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.animate();
                    this.isAnimated = true;
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.svg);
    }

    animate(duration = 1500) {
        this.paths.forEach((path, index) => {
            const length = path.getTotalLength ? path.getTotalLength() : 0;
            if (!length) return;

            const delay = index * 100; // Stagger animation

            setTimeout(() => {
                path.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
                path.style.strokeDashoffset = '0';
            }, delay);
        });
    }

    reset() {
        this.paths.forEach(path => {
            const length = path.getTotalLength ? path.getTotalLength() : 0;
            if (length) {
                path.style.transition = 'none';
                path.style.strokeDashoffset = length;
            }
        });
        this.isAnimated = false;
    }
}

// ============================================
// LOTTIE-STYLE JSON ANIMATIONS
// ============================================

/**
 * Simple keyframe animator for JSON-defined animations
 * Lightweight alternative to Lottie for simple animations
 */
class KeyframeAnimator {
    constructor(element, keyframes) {
        this.element = element;
        this.keyframes = keyframes; // Array of {time, properties}
        this.duration = keyframes[keyframes.length - 1].time;
        this.startTime = null;
        this.isPlaying = false;
    }

    play() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.startTime = performance.now();
        this.animate();
    }

    animate() {
        if (!this.isPlaying) return;

        const currentTime = performance.now() - this.startTime;
        const progress = Math.min(currentTime / this.duration, 1);

        // Find current keyframe
        let prevFrame = this.keyframes[0];
        let nextFrame = this.keyframes[this.keyframes.length - 1];

        for (let i = 0; i < this.keyframes.length - 1; i++) {
            if (currentTime >= this.keyframes[i].time && currentTime < this.keyframes[i + 1].time) {
                prevFrame = this.keyframes[i];
                nextFrame = this.keyframes[i + 1];
                break;
            }
        }

        // Interpolate properties
        const frameProgress = (currentTime - prevFrame.time) / (nextFrame.time - prevFrame.time);
        this.interpolate(prevFrame.properties, nextFrame.properties, frameProgress);

        if (progress < 1) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isPlaying = false;
        }
    }

    interpolate(start, end, progress) {
        Object.keys(start).forEach(prop => {
            const startValue = start[prop];
            const endValue = end[prop];

            if (typeof startValue === 'number') {
                const value = startValue + (endValue - startValue) * progress;
                this.element.style[prop] = prop.includes('opacity') ? value : `${value}px`;
            }
        });
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.startTime = null;
        this.isPlaying = false;
        this.interpolate(this.keyframes[0].properties, this.keyframes[0].properties, 1);
    }
}

// ============================================
// MORPHING TEXT ANIMATION
// ============================================

/**
 * Morph between different text strings with smooth character transitions
 * Apple-style text morphing effect
 */
class TextMorph {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentIndex = 0;
        this.interval = options.interval || 3000;
        this.morphDuration = options.morphDuration || 800;

        this.element.textContent = this.texts[0];
        this.startCycle();
    }

    startCycle() {
        setInterval(() => {
            this.morphToNext();
        }, this.interval);
    }

    morphToNext() {
        const nextIndex = (this.currentIndex + 1) % this.texts.length;
        const currentText = this.texts[this.currentIndex];
        const nextText = this.texts[nextIndex];

        // Simple fade morph
        this.element.style.transition = `opacity ${this.morphDuration / 2}ms ease-out`;
        this.element.style.opacity = '0';

        setTimeout(() => {
            this.element.textContent = nextText;
            this.element.style.opacity = '1';
            this.currentIndex = nextIndex;
        }, this.morphDuration / 2);
    }
}

// ============================================
// SCROLL-TRIGGERED VIDEO SCENES
// ============================================

/**
 * Create scroll-driven video sections
 * Each section plays a different part of the video
 */
class ScrollVideoScenes {
    constructor(videoElement, scenes) {
        this.video = videoElement;
        this.scenes = scenes; // Array of {start, end, scrollStart, scrollEnd}
        this.currentScene = null;

        this.init();
    }

    init() {
        let ticking = false;

        const updateScene = () => {
            const scrollTop = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollTop / maxScroll;

            // Find current scene
            for (const scene of this.scenes) {
                if (scrollProgress >= scene.scrollStart && scrollProgress <= scene.scrollEnd) {
                    // Calculate video time within scene
                    const sceneProgress = (scrollProgress - scene.scrollStart) / (scene.scrollEnd - scene.scrollStart);
                    const videoTime = scene.start + (scene.end - scene.start) * sceneProgress;

                    this.video.currentTime = videoTime;
                    break;
                }
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScene);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Prevent normal video playback
        this.video.pause();
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Auto-initialize all video animations
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas sequences
    document.querySelectorAll('canvas[data-frame-count]').forEach(canvas => {
        new CanvasSequence(canvas);
    });

    // Initialize enhanced video players
    document.querySelectorAll('video.apple-video').forEach(video => {
        new VideoPlayer(video);
    });

    // Initialize SVG animations
    document.querySelectorAll('svg[data-animate-draw]').forEach(svg => {
        new SVGAnimator(svg);
    });

    // Initialize text morphs
    document.querySelectorAll('[data-text-morph]').forEach(element => {
        const texts = element.dataset.textMorph.split('|');
        new TextMorph(element, texts);
    });
});

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CanvasSequence,
        VideoPlayer,
        SVGAnimator,
        KeyframeAnimator,
        TextMorph,
        ScrollVideoScenes
    };
}
