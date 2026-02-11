import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostofnewRrReportComponent } from './costofnew-rr-report.component';

describe('CostofnewRrReportComponent', () => {
  let component: CostofnewRrReportComponent;
  let fixture: ComponentFixture<CostofnewRrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostofnewRrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostofnewRrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
