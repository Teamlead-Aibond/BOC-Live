/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPortalListPoComponent } from './vendor-portal-list-po.component';

describe('VendorPortalListPoComponent', () => {
  let component: VendorPortalListPoComponent;
  let fixture: ComponentFixture<VendorPortalListPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPortalListPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPortalListPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
