import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrVendorInvoiceComponent } from './rr-vendor-invoice.component';

describe('RrVendorInvoiceComponent', () => {
  let component: RrVendorInvoiceComponent;
  let fixture: ComponentFixture<RrVendorInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrVendorInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrVendorInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
