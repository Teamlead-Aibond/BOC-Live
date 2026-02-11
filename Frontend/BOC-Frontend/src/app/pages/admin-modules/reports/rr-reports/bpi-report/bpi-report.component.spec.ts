import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpiReportComponent } from './bpi-report.component';

describe('BpiReportComponent', () => {
  let component: BpiReportComponent;
  let fixture: ComponentFixture<BpiReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpiReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
