import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmaReportComponent } from './rma-report.component';

describe('RmaReportComponent', () => {
  let component: RmaReportComponent;
  let fixture: ComponentFixture<RmaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
