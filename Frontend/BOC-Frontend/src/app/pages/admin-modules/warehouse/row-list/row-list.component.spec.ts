/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowListComponent } from './row-list.component';

describe('RowListComponent', () => {
  let component: RowListComponent;
  let fixture: ComponentFixture<RowListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
