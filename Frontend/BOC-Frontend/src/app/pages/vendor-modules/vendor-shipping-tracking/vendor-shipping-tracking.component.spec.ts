/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorShippingTrackingComponent } from './vendor-shipping-tracking.component';

describe('VendorShippingTrackingComponent', () => {
  let component: VendorShippingTrackingComponent;
  let fixture: ComponentFixture<VendorShippingTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorShippingTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorShippingTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
