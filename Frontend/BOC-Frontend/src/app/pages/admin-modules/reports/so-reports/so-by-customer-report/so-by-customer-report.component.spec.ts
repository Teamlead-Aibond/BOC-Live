import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoByCustomerReportComponent } from './so-by-customer-report.component';

describe('SoByCustomerReportComponent', () => {
  let component: SoByCustomerReportComponent;
  let fixture: ComponentFixture<SoByCustomerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoByCustomerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoByCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
