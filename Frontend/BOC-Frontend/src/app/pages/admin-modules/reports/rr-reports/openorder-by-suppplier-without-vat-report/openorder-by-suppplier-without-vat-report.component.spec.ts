import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenorderBySuppplierWithoutVatReportComponent } from './openorder-by-suppplier-without-vat-report.component';

describe('OpenorderBySuppplierWithoutVatReportComponent', () => {
  let component: OpenorderBySuppplierWithoutVatReportComponent;
  let fixture: ComponentFixture<OpenorderBySuppplierWithoutVatReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenorderBySuppplierWithoutVatReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenorderBySuppplierWithoutVatReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
