import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmRepairTrackerComponent } from './gm-repair-tracker.component';

describe('GmRepairTrackerComponent', () => {
  let component: GmRepairTrackerComponent;
  let fixture: ComponentFixture<GmRepairTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmRepairTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmRepairTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
