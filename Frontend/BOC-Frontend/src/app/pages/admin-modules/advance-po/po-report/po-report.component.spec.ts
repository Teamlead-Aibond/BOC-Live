/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReportComponent } from './po-report.component';

describe('PoReportComponent', () => {
  let component: PoReportComponent;
  let fixture: ComponentFixture<PoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
