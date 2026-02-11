import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureTrendAnalysisReportComponent } from './failure-trend-analysis-report.component';

describe('FailureTrendAnalysisReportComponent', () => {
  let component: FailureTrendAnalysisReportComponent;
  let fixture: ComponentFixture<FailureTrendAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureTrendAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureTrendAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
