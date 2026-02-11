/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsSoapComponent } from './ups-soap.component';

describe('UpsSoapComponent', () => {
  let component: UpsSoapComponent;
  let fixture: ComponentFixture<UpsSoapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsSoapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsSoapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
