import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoByVendorReportComponent } from './po-by-vendor-report.component';

describe('PoByVendorReportComponent', () => {
  let component: PoByVendorReportComponent;
  let fixture: ComponentFixture<PoByVendorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoByVendorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoByVendorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
