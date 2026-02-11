import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipviaReportComponent } from './shipvia-report.component';

describe('ShipviaReportComponent', () => {
  let component: ShipviaReportComponent;
  let fixture: ComponentFixture<ShipviaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipviaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipviaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
