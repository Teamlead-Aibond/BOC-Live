/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRListComponent } from './rr-list.component';

describe('RRListComponent', () => {
  let component: RRListComponent;
  let fixture: ComponentFixture<RRListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
