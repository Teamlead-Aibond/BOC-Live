/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JunologinComponent } from './junologin.component';

describe('JunologinComponent', () => {
  let component: JunologinComponent;
  let fixture: ComponentFixture<JunologinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JunologinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JunologinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
