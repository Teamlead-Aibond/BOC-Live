/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoTopComponent } from './blanket-po-top.component';

describe('BlanketPoTopComponent', () => {
  let component: BlanketPoTopComponent;
  let fixture: ComponentFixture<BlanketPoTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
