import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceMonthlyDetailedReportComponent } from './invoice-monthly-detailed-report.component';

describe('InvoiceMonthlyDetailedReportComponent', () => {
  let component: InvoiceMonthlyDetailedReportComponent;
  let fixture: ComponentFixture<InvoiceMonthlyDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceMonthlyDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMonthlyDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
