import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableTaxReportComponent } from './payable-tax-report.component';

describe('PayableTaxReportComponent', () => {
  let component: PayableTaxReportComponent;
  let fixture: ComponentFixture<PayableTaxReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayableTaxReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableTaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
