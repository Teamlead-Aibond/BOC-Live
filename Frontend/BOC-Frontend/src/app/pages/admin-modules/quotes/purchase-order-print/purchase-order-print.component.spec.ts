import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderPrintComponent } from './purchase-order-print.component';

describe('PurchaseOrderPrintComponent', () => {
  let component: PurchaseOrderPrintComponent;
  let fixture: ComponentFixture<PurchaseOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
