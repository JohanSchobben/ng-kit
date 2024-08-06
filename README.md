# NgKitApp

A style less component library for some of the UI components used in angular. The library is build on top of the cdk and provides tooltips that the cdk is missing

## How to install
TODO add to npm


## UI elements
Below you find an example on how to use some of the elements

### Tooltips

#### Usage

1. Make sure you load the overlay-prebuilt css file in your global styles.scss

```scss
// styles.scss
@import "@angular/cdk/overlay-prebuilt.css";
```
Alternatively, you can also add the file to your angular.json

```json
"styles": ["./src/styles.css", "./node_modules/@angular/cdk/overlay-prebuilt.css"],
```

2. Import the TooltipModule from ng-kit/tooltip

```typescript
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ng-kit/tooltip';

@ngModule({
  declerations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    TooltipModule
  ]
})
export class AppModule {
}
```

_The tooltip uses angular animations to fade in and to fade out, make sure you eiter add the BrowserAnimationsModule or the NoopAnimationsModule_

3. use the tooltip
```angular2html
<button kitTooltip="Hello World!">My button!</button>
```

#### options

The tooltip has some options that can be set to suite your need. You can provide the following two options:

- `delay` the amount of time that should pass before showing the tootlip
- `class`/`className` which classes should be added to the tooltip element. This can be used to style the tooltip

You can pass them to element by adding prefixing the attribute wit `kitTooltip`
```angular2html
<!-- this will render the tooltip after 1 second (1000ms) and will give it the class "my-tooltip-class" -->
<button kitTooltip="Hello World!" kitTooltipDelay="1000" kitTooltipClass="my-tooltip-class">My button!</button>
```

If you want to setup config for all tooltips, you can provide a value via DI:

```typescript
import { AppComponent } from './app.component';
import { TooltipModule, KIT_TOOLTIP_OPTIONS } from 'ng-kit/tooltip';

@ngModule({
  declerations: [AppComponent],
  imports: [
    TooltipModule
  ],
  provider: [
    {
      provide: KIT_TOOLTIP_OPTIONS,
      useValue: {
        delay: 1000,
        className: 'my-tooltip-class'
      }
    }
  ]
})
export class AppModule {
}
```




