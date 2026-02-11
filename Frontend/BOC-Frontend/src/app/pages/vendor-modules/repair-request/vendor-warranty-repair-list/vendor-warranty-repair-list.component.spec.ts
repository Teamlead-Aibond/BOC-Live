/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWarrantyRepairListComponent } from './vendor-warranty-repair-list.component';

describe('VendorWarrantyRepairListComponent', () => {
  let component: VendorWarrantyRepairListComponent;
  let fixture: ComponentFixture<VendorWarrantyRepairListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorWarrantyRepairListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWarrantyRepairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
