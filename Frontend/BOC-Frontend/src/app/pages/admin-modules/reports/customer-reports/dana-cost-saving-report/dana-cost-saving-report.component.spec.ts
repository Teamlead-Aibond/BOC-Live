import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanaCostSavingReportComponent } from './dana-cost-saving-report.component';

describe('DanaCostSavingReportComponent', () => {
  let component: DanaCostSavingReportComponent;
  let fixture: ComponentFixture<DanaCostSavingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanaCostSavingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanaCostSavingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
