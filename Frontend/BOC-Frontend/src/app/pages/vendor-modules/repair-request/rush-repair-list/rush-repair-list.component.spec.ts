/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RushRepairListComponent } from './rush-repair-list.component';

describe('RushRepairListComponent', () => {
  let component: RushRepairListComponent;
  let fixture: ComponentFixture<RushRepairListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RushRepairListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RushRepairListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
