import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoiceDetailedCurrencyReportComponent } from './monthly-invoice-detailed-currency-report.component';

describe('MonthlyInvoiceDetailedCurrencyReportComponent', () => {
  let component: MonthlyInvoiceDetailedCurrencyReportComponent;
  let fixture: ComponentFixture<MonthlyInvoiceDetailedCurrencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyInvoiceDetailedCurrencyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyInvoiceDetailedCurrencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
