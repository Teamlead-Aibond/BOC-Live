/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePurchaseOrderComponent } from './invoice-purchase-order.component';

describe('InvoicePurchaseOrderComponent', () => {
  let component: InvoicePurchaseOrderComponent;
  let fixture: ComponentFixture<InvoicePurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
