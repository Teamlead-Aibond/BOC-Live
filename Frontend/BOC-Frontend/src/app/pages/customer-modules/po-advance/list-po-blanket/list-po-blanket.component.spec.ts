/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPoBlanketComponent } from './list-po-blanket.component';

describe('ListPoBlanketComponent', () => {
  let component: ListPoBlanketComponent;
  let fixture: ComponentFixture<ListPoBlanketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPoBlanketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPoBlanketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
