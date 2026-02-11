import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoMonthlyReportComponent } from './so-monthly-report.component';

describe('SoMonthlyReportComponent', () => {
  let component: SoMonthlyReportComponent;
  let fixture: ComponentFixture<SoMonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoMonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
