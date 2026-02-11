import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroVendorInvoiceComponent } from './mro-vendor-invoice.component';

describe('MroVendorInvoiceComponent', () => {
  let component: MroVendorInvoiceComponent;
  let fixture: ComponentFixture<MroVendorInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroVendorInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroVendorInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
