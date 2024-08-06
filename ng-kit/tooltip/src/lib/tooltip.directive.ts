import {
  Directive,
  ElementRef,
  Inject,
  Input, numberAttribute,
  OnChanges,
  OnDestroy, OnInit,
  Optional,
  SimpleChanges
} from '@angular/core';
import {Overlay, OverlayRef, ScrollDispatcher} from "@angular/cdk/overlay";
import { fromEvent, map, merge, Subject, switchMap, takeUntil, timer } from 'rxjs';
import {hasModifierKey} from "@angular/cdk/keycodes";
import {TooltipComponent} from "./tooltip.component";
import {ComponentPortal} from "@angular/cdk/portal";
import {KitTooltipOptions} from "./kit-tooltip-options";
import {KIT_TOOLTIP_OPTIONS} from "./tooltip-token";

@Directive({
  selector: '[kitTooltip]',
  host: {
    "[attr.aria-describedby]": "tooltipId"
  }
})
export class TooltipDirective implements OnDestroy, OnChanges, OnInit {
  private overlayRef?: OverlayRef;
  private destroy: Subject<void> = new Subject<void>();
  protected tooltip?: TooltipComponent;
  private _message?: string;
  private portal?: ComponentPortal<TooltipComponent>;
  private _className?: string;

  @Input({alias: "kitTooltipDelay", transform: numberAttribute})
  public delay?: number;

  @Input("kitTooltip")
  set message(message: string) {
    this._message = message;
    if (this.tooltip) {
      this.tooltip.message = message;
    }
  }

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    @Optional() @Inject(KIT_TOOLTIP_OPTIONS) private options: KitTooltipOptions
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes["delay"] && !changes["delay"].firstChange) {
      console.warn("You are changing the delay on an already initialized tooltip, this is not possible.");
    }
  }

  public ngOnInit() {
    const simpleMouseenter$ = fromEvent<MouseEvent>(this.el.nativeElement, "mouseenter");
    const simpleMouseLeave$ = fromEvent<MouseEvent>(this.el.nativeElement, "mouseleave");
    const simpleTouchStart$ = fromEvent<TouchEvent>(this.el.nativeElement, "touchstart");
    const simpleTouchEnd$ = fromEvent<TouchEvent>(this.el.nativeElement, "touchend");
    const simpleFocus$ = fromEvent<FocusEvent>(this.el.nativeElement, "focus");
    const simpleBlur$ = fromEvent<FocusEvent>(this.el.nativeElement, "blur");
    const delay = this.delay ?? this.options?.delay ?? 0;

    const mouseenter$ = simpleMouseenter$
      .pipe(
        takeUntil(this.destroy),
        switchMap(() =>
          timer(delay)
            .pipe(
              takeUntil(simpleMouseLeave$),
            ))
      );

    const touchStart$ = simpleTouchStart$
      .pipe(
        takeUntil(this.destroy),
        switchMap(() =>
          timer(delay)
            .pipe(
              takeUntil(simpleTouchEnd$),
            ))
      );

    const focus$ = simpleFocus$
      .pipe(
        takeUntil(this.destroy),
        switchMap(() =>
          timer(delay)
            .pipe(
              takeUntil(simpleBlur$),
            ))
      );

    merge(mouseenter$, touchStart$, focus$)
      .subscribe(() => {
        this.show()
    });

    merge(simpleBlur$, simpleTouchEnd$, simpleMouseLeave$)
      .pipe(
        takeUntil(this.destroy),
      ).subscribe(() => {
      this.hide();
    });
  }

  public get tooltipId(): string {
    return this.tooltip?.id ?? '';
  }

  public get className(): string {
    return this._className ?? this.options?.className ?? '';
  }

  @Input("kitTooltipClass")
  public set className(className: string) {
    this._className = className;
    if (this.tooltip) {
      this.tooltip.tooltipClass = className;
    }
  }

  private createOverlay(): OverlayRef {
    const scrollableContainer = this.scrollDispatcher.getAncestorScrollContainers(this.el);
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el.nativeElement)
      .withFlexibleDimensions(false)
      .withPositions([
        {
          originY: "top",
          originX: "center",
          overlayY: "bottom",
          overlayX: "center"
        },
        {
          originY: "bottom",
          originX: "center",
          overlayY: "top",
          overlayX: "center"
        }
      ])
      .withViewportMargin(0)
      .withScrollableContainers(scrollableContainer);


    this.overlayRef = this.overlay.create({
      direction: "ltr",
      positionStrategy: strategy,
      panelClass: "kit-tooltip",
      scrollStrategy: this.overlay.scrollStrategies.reposition({scrollThrottle: 20})
    });


    this.overlayRef.detachments().pipe(takeUntil(this.destroy)).subscribe(() => {
        this.hide();
    });

    this.overlayRef.outsidePointerEvents().pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.overlayRef?.hasAttached()) {
        this.hide();
      }
    });

    this.overlayRef.keydownEvents().pipe(takeUntil(this.destroy)).subscribe((event) => {
      if (event.key === "Escape" && !hasModifierKey(event)) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }
    });
    return this.overlayRef;
  }

private createPortal(): ComponentPortal<TooltipComponent> {
    this.portal = new ComponentPortal<TooltipComponent>(TooltipComponent);
    return this.portal;
}

private hide() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef?.detach();
      this.tooltip = undefined;
    }
}

  private show(): void {
    if (this.tooltip) return
    const overlay = this.createOverlay();
    const portal = this.portal ?? this.createPortal();
    const component = overlay.attach(portal);
    this.tooltip = component.instance as TooltipComponent;
    this.tooltip.message = this._message;
    this.tooltip.tooltipClass = this.className;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
