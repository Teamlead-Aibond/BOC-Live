/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorScoreboardComponent } from './vendor-scoreboard.component';

describe('VendorScoreboardComponent', () => {
  let component: VendorScoreboardComponent;
  let fixture: ComponentFixture<VendorScoreboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorScoreboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
