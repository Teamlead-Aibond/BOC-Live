/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMroComponent } from './add-mro.component';

describe('AddMroComponent', () => {
  let component: AddMroComponent;
  let fixture: ComponentFixture<AddMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
