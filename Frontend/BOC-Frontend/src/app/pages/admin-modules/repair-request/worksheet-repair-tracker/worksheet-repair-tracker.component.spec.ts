import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetRepairTrackerComponent } from './worksheet-repair-tracker.component';

describe('WorksheetRepairTrackerComponent', () => {
  let component: WorksheetRepairTrackerComponent;
  let fixture: ComponentFixture<WorksheetRepairTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetRepairTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetRepairTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
