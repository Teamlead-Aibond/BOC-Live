import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoMonthlyDetailedCurrencyReportComponent } from './so-monthly-detailed-currency-report.component';

describe('SoMonthlyDetailedCurrencyReportComponent', () => {
  let component: SoMonthlyDetailedCurrencyReportComponent;
  let fixture: ComponentFixture<SoMonthlyDetailedCurrencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoMonthlyDetailedCurrencyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoMonthlyDetailedCurrencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
