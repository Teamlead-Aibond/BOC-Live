import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRepairTrackerSideComponent } from './outgoing-repair-tracker-side.component';

describe('OutgoingRepairTrackerSideComponent', () => {
  let component: OutgoingRepairTrackerSideComponent;
  let fixture: ComponentFixture<OutgoingRepairTrackerSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingRepairTrackerSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingRepairTrackerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
