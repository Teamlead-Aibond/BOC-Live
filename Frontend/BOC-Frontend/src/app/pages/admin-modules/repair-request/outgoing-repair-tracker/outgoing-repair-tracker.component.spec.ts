import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRepairTrackerComponent } from './outgoing-repair-tracker.component';

describe('OutgoingRepairTrackerComponent', () => {
  let component: OutgoingRepairTrackerComponent;
  let fixture: ComponentFixture<OutgoingRepairTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingRepairTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingRepairTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
