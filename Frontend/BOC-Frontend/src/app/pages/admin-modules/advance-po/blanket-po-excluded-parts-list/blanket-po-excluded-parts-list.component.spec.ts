/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoExcludedPartsListComponent } from './blanket-po-excluded-parts-list.component';

describe('BlanketPoExcludedPartsListComponent', () => {
  let component: BlanketPoExcludedPartsListComponent;
  let fixture: ComponentFixture<BlanketPoExcludedPartsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoExcludedPartsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoExcludedPartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
