/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMroComponent } from './edit-mro.component';

describe('EditMroComponent', () => {
  let component: EditMroComponent;
  let fixture: ComponentFixture<EditMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
