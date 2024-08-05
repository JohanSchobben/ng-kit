import {Component, HostBinding, Input} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'kit-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  host: {
    "[id]": "id",
    "attr.aria-role": "tooltip",
    "[class]": "tooltipClass",
  },
  animations: [
    trigger('tooltip', [
      transition(':enter', [style({opacity: 0, transform: 'scale(0)'}), animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({
        opacity: 1,
        transform: 'scale(1)'
      }))]),
      transition(':leave', [animate('75ms cubic-bezier(0.4, 0, 1, 1)', style({
        opacity: 0,
        transform: 'scale(0)',
      }))]),
    ])
  ]
})
export class TooltipComponent {
  @Input()
  tooltipClass?: string;
  @Input() message?: string;
  private static tooltipCount = 0;
  public readonly id = `tooltip-${++TooltipComponent.tooltipCount}`;


  @HostBinding("@tooltip")
  public get animations(): true {
    return true;
  }
}
