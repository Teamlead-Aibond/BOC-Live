import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkShippingPackingslipComponent } from './bulk-shipping-packingslip.component';

describe('BulkShippingPackingslipComponent', () => {
  let component: BulkShippingPackingslipComponent;
  let fixture: ComponentFixture<BulkShippingPackingslipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkShippingPackingslipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkShippingPackingslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
