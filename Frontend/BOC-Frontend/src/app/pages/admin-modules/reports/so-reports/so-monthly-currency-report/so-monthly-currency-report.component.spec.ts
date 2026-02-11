import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoMonthlyCurrencyReportComponent } from './so-monthly-currency-report.component';

describe('SoMonthlyCurrencyReportComponent', () => {
  let component: SoMonthlyCurrencyReportComponent;
  let fixture: ComponentFixture<SoMonthlyCurrencyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoMonthlyCurrencyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoMonthlyCurrencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
