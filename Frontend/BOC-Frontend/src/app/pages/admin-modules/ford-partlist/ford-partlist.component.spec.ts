/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FordPartlistComponent } from './ford-partlist.component';

describe('FordPartlistComponent', () => {
  let component: FordPartlistComponent;
  let fixture: ComponentFixture<FordPartlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FordPartlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FordPartlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
