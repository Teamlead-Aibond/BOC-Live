import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmRepairTrackerReportComponent } from './gm-repair-tracker-report.component';

describe('GmRepairTrackerReportComponent', () => {
  let component: GmRepairTrackerReportComponent;
  let fixture: ComponentFixture<GmRepairTrackerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmRepairTrackerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmRepairTrackerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
