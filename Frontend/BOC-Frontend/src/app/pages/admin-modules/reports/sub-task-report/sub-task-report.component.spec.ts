import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskReportComponent } from './sub-task-report.component';

describe('SubTaskReportComponent', () => {
  let component: SubTaskReportComponent;
  let fixture: ComponentFixture<SubTaskReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTaskReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
