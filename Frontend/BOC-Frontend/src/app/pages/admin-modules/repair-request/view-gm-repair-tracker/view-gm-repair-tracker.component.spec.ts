import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGmRepairTrackerComponent } from './view-gm-repair-tracker.component';

describe('ViewGmRepairTrackerComponent', () => {
  let component: ViewGmRepairTrackerComponent;
  let fixture: ComponentFixture<ViewGmRepairTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGmRepairTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGmRepairTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
