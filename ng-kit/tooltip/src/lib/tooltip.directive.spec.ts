import { Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { TooltipDirective } from './tooltip.directive';
import { Component, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';


@Component({
  selector: 'kit-test',
  template: `
    <div id="host" kitTooltip="Hello world!">Some div</div>
  `
})
class TooltipTestComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TooltipTestComponent>;
  let directive: TooltipDirective;
  let hostElement: DebugElement;

  const detachments = new Subject<void>();
  const outsidePointerEvents = new Subject<void>();
  const keydownEvents: Subject<{key: string}> = new Subject<{key: string}>();
  const hasAttachedSpy = jest.fn();
  const detachSpy = jest.fn();
  const attachSpy = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TooltipTestComponent, TooltipDirective],
      providers: [
        {
          provide: Overlay,
          useValue: {
            create() {
              return {
                detachments() {
                  return detachments;
                },
                outsidePointerEvents() {
                  return outsidePointerEvents;
                },
                keydownEvents() {
                  return keydownEvents;
                },
                hasAttached: hasAttachedSpy,
                detach: detachSpy,
                attach: attachSpy
              }
            }
          }
        },
        {
          provide: ScrollDispatcher,
          useValue: {
            getAncestorScrollContainers() {
              return [];
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipTestComponent);
    directive = fixture.debugElement.query(By.directive(TooltipDirective)).componentInstance;
    hostElement = fixture.debugElement.query(By.css('#host'));
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should not log a warning if the delay gets changed for the first time', () => {
    const spy = jest.spyOn(console, 'warn');
    const directive2= new TooltipDirective({nativeElement: null}, TestBed.inject(Overlay), TestBed.inject(ScrollDispatcher), {})

    directive2.ngOnChanges({
      delay: new SimpleChange(null, 2, true)
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should log if delay is changed for a second time', () => {
    const spy = jest.spyOn(console, 'warn');
    const directive2= new TooltipDirective({nativeElement: null}, TestBed.inject(Overlay), TestBed.inject(ScrollDispatcher), {})

    directive2.ngOnChanges({
      delay: new SimpleChange(1, 2, false)
    });

    expect(spy).toHaveBeenCalled();

  });

});
