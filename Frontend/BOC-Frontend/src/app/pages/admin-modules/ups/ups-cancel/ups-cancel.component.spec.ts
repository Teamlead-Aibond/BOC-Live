/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsCancelComponent } from './ups-cancel.component';

describe('UpsCancelComponent', () => {
  let component: UpsCancelComponent;
  let fixture: ComponentFixture<UpsCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
