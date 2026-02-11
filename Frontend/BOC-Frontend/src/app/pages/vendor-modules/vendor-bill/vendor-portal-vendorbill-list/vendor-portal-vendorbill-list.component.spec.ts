/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPortalVendorbillListComponent } from './vendor-portal-vendorbill-list.component';

describe('VendorPortalVendorbillListComponent', () => {
  let component: VendorPortalVendorbillListComponent;
  let fixture: ComponentFixture<VendorPortalVendorbillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPortalVendorbillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPortalVendorbillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
