import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonRawReportComponent } from './amazon-raw-report.component';

describe('AmazonRawReportComponent', () => {
  let component: AmazonRawReportComponent;
  let fixture: ComponentFixture<AmazonRawReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmazonRawReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazonRawReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
