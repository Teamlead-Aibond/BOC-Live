/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroListComponent } from './mro-list.component';

describe('MroListComponent', () => {
  let component: MroListComponent;
  let fixture: ComponentFixture<MroListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
