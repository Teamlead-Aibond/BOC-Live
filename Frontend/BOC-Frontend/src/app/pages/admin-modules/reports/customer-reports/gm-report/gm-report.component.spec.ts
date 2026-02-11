import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmReportComponent } from './gm-report.component';

describe('GmReportComponent', () => {
  let component: GmReportComponent;
  let fixture: ComponentFixture<GmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
