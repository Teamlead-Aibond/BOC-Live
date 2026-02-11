/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoBlanketListComponent } from './so-blanket-list.component';

describe('SoBlanketListComponent', () => {
  let component: SoBlanketListComponent;
  let fixture: ComponentFixture<SoBlanketListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoBlanketListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoBlanketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
