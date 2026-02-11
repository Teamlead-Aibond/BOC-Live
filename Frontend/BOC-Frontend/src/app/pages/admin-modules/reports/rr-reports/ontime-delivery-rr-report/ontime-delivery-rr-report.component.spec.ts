import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntimeDeliveryRrReportComponent } from './ontime-delivery-rr-report.component';

describe('OntimeDeliveryRrReportComponent', () => {
  let component: OntimeDeliveryRrReportComponent;
  let fixture: ComponentFixture<OntimeDeliveryRrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntimeDeliveryRrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntimeDeliveryRrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
