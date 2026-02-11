/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoEdit2Component } from './blanket-po-edit2.component';

describe('BlanketPoEdit2Component', () => {
  let component: BlanketPoEdit2Component;
  let fixture: ComponentFixture<BlanketPoEdit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoEdit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoEdit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
