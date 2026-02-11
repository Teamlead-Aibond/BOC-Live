import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRCreatedByUserReportComponent } from './rr-created-by-user-report.component';

describe('RRCreatedByUserReportComponent', () => {
  let component: RRCreatedByUserReportComponent;
  let fixture: ComponentFixture<RRCreatedByUserReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRCreatedByUserReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRCreatedByUserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
