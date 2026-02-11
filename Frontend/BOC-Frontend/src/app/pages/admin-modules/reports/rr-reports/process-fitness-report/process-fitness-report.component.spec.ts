import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFitnessReportComponent } from './process-fitness-report.component';

describe('ProcessFitnessReportComponent', () => {
  let component: ProcessFitnessReportComponent;
  let fixture: ComponentFixture<ProcessFitnessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFitnessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFitnessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
