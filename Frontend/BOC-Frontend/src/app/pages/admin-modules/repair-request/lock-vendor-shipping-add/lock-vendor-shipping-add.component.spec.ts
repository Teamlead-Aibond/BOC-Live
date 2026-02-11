import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockVendorShippingAddComponent } from './lock-vendor-shipping-add.component';

describe('LockVendorShippingAddComponent', () => {
  let component: LockVendorShippingAddComponent;
  let fixture: ComponentFixture<LockVendorShippingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockVendorShippingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockVendorShippingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
