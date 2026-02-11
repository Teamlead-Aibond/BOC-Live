import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingHistoryCustomerPortalComponent } from './shipping-history-customer-portal.component';

describe('ShippingHistoryCustomerPortalComponent', () => {
  let component: ShippingHistoryCustomerPortalComponent;
  let fixture: ComponentFixture<ShippingHistoryCustomerPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingHistoryCustomerPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingHistoryCustomerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
