import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoiceCurrencyReportComponent } from './monthly-invoice-currency-report.component';

describe('MonthlyInvoiceCurrencyReportComponent', () => {
  let component: MonthlyInvoiceCurrencyReportComponent;
  let fixture: ComponentFixture<MonthlyInvoiceCurrencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyInvoiceCurrencyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyInvoiceCurrencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
