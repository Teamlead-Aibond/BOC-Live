import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatTaxReportComponent } from './vat-tax-report.component';

describe('VatTaxReportComponent', () => {
  let component: VatTaxReportComponent;
  let fixture: ComponentFixture<VatTaxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatTaxReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatTaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
