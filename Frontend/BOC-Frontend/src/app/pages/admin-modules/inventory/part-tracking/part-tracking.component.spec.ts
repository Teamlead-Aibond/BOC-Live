import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTrackingComponent } from './part-tracking.component';

describe('PartTrackingComponent', () => {
  let component: PartTrackingComponent;
  let fixture: ComponentFixture<PartTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
