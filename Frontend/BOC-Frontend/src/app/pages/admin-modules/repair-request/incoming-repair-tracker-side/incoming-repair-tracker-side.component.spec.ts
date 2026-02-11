import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingRepairTrackerSideComponent } from './incoming-repair-tracker-side.component';

describe('IncomingRepairTrackerSideComponent', () => {
  let component: IncomingRepairTrackerSideComponent;
  let fixture: ComponentFixture<IncomingRepairTrackerSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomingRepairTrackerSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingRepairTrackerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
