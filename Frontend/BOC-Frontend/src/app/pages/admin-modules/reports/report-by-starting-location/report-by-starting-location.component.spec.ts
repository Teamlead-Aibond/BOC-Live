import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportByStartingLocationComponent } from './report-by-starting-location.component';

describe('ReportByStartingLocationComponent', () => {
  let component: ReportByStartingLocationComponent;
  let fixture: ComponentFixture<ReportByStartingLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportByStartingLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportByStartingLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
