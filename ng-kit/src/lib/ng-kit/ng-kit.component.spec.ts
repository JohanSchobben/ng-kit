import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgKitComponent } from './ng-kit.component';

describe('NgKitComponent', () => {
  let component: NgKitComponent;
  let fixture: ComponentFixture<NgKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgKitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
