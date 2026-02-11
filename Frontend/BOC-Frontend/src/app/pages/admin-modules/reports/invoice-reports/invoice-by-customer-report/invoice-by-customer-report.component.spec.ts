import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceByCustomerReportComponent } from './invoice-by-customer-report.component';

describe('InvoiceByCustomerReportComponent', () => {
  let component: InvoiceByCustomerReportComponent;
  let fixture: ComponentFixture<InvoiceByCustomerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceByCustomerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceByCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
