import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenorderBySuppplierReportComponent } from './openorder-by-suppplier-report.component';

describe('OpenorderBySuppplierReportComponent', () => {
  let component: OpenorderBySuppplierReportComponent;
  let fixture: ComponentFixture<OpenorderBySuppplierReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenorderBySuppplierReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenorderBySuppplierReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
