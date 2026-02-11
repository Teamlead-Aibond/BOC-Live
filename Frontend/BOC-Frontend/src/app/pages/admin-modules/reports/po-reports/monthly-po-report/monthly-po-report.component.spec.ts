import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPoReportComponent } from './monthly-po-report.component';

describe('MonthlyPoReportComponent', () => {
  let component: MonthlyPoReportComponent;
  let fixture: ComponentFixture<MonthlyPoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyPoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
