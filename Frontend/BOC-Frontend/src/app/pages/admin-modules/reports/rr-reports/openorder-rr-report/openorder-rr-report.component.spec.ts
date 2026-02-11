import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenorderRrReportComponent } from './openorder-rr-report.component';

describe('OpenorderRrReportComponent', () => {
  let component: OpenorderRrReportComponent;
  let fixture: ComponentFixture<OpenorderRrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenorderRrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenorderRrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
