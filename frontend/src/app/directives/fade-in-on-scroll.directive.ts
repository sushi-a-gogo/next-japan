import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

export interface FadeInConfig {
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade-scale';
  threshold?: number;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number; // in ms
}

@Directive({
  selector: '[fadeInOnScroll]',
  standalone: true,
})
export class FadeInOnScrollDirective implements OnInit, OnDestroy {
  @Input('fadeInOnScroll') config?: FadeInConfig | '';

  private observer?: IntersectionObserver;
  private readonly isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const cfg = (typeof this.config === 'object' ? this.config : {}) as FadeInConfig;
    const {
      animation,
      staggerChildren,
      staggerDelay,
    } = cfg;

    this.renderer.addClass(this.el.nativeElement, 'fade-in-section');
    if (animation) {
      this.renderer.addClass(this.el.nativeElement, animation);
    }

    if (!this.isBrowser) {
      this.renderer.addClass(this.el.nativeElement, 'fade-in-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (staggerChildren) {
              const children = Array.from(
                this.el.nativeElement.children
              ) as HTMLElement[];

              children.forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add('fade-in-visible');
                }, index * (staggerDelay || 100));
              });
            } else {
              this.renderer.addClass(this.el.nativeElement, 'fade-in-visible');
            }

            if (cfg.once) {
              this.observer?.unobserve(this.el.nativeElement);
            }
          } else if (!cfg.once) {
            if (staggerChildren) {
              const children = Array.from(
                this.el.nativeElement.children
              ) as HTMLElement[];
              children.forEach((child) =>
                child.classList.remove('fade-in-visible')
              );
            } else {
              this.renderer.removeClass(this.el.nativeElement, 'fade-in-visible');
            }
          }
        }
      },
      { threshold: cfg.threshold ?? 0.1 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.isBrowser) this.observer?.disconnect();
  }
}
