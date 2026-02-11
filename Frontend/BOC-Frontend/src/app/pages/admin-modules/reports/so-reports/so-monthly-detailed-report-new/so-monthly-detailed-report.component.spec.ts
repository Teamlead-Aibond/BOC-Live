import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoMonthlyDetailedReportComponent } from './so-monthly-detailed-report.component';

describe('SoMonthlyDetailedReportComponent', () => {
  let component: SoMonthlyDetailedReportComponent;
  let fixture: ComponentFixture<SoMonthlyDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoMonthlyDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoMonthlyDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
