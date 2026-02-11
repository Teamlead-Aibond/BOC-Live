import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoVatTaxReportComponent } from './po-vat-tax-report.component';

describe('PoVatTaxReportComponent', () => {
  let component: PoVatTaxReportComponent;
  let fixture: ComponentFixture<PoVatTaxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoVatTaxReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoVatTaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
