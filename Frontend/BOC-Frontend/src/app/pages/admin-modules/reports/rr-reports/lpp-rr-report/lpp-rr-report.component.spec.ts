import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LppRrReportComponent } from './lpp-rr-report.component';

describe('LppRrReportComponent', () => {
  let component: LppRrReportComponent;
  let fixture: ComponentFixture<LppRrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LppRrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LppRrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
