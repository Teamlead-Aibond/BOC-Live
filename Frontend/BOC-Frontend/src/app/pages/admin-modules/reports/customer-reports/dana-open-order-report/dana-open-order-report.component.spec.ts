import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanaOpenOrderReportComponent } from './dana-open-order-report.component';

describe('DanaOpenOrderReportComponent', () => {
  let component: DanaOpenOrderReportComponent;
  let fixture: ComponentFixture<DanaOpenOrderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanaOpenOrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanaOpenOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
