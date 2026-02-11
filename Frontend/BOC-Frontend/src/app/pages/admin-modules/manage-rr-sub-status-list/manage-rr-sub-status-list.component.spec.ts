/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRRSubStatusListComponent } from './manage-rr-sub-status-list.component';

describe('ManageRRSubStatusListComponent', () => {
  let component: ManageRRSubStatusListComponent;
  let fixture: ComponentFixture<ManageRRSubStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRRSubStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRRSubStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
