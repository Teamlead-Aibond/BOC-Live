import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoiceReportComponent } from './monthly-invoice-report.component';

describe('MonthlyInvoiceReportComponent', () => {
  let component: MonthlyInvoiceReportComponent;
  let fixture: ComponentFixture<MonthlyInvoiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyInvoiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyInvoiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
