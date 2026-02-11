import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoMonthlyDetailedReportComponent } from './po-monthly-detailed-report.component';

describe('PoMonthlyDetailedReportComponent', () => {
  let component: PoMonthlyDetailedReportComponent;
  let fixture: ComponentFixture<PoMonthlyDetailedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoMonthlyDetailedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMonthlyDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
