import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReportComponent } from './reject-report.component';

describe('RejectReportComponent', () => {
  let component: RejectReportComponent;
  let fixture: ComponentFixture<RejectReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
