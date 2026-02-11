import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipToVendorComponent } from './ship-to-vendor.component';

describe('ShipToVendorComponent', () => {
  let component: ShipToVendorComponent;
  let fixture: ComponentFixture<ShipToVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipToVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipToVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
