import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRFollowupNotesComponent } from './rr-followup-notes.component';

describe('RRFollowupNotesComponent', () => {
  let component: RRFollowupNotesComponent;
  let fixture: ComponentFixture<RRFollowupNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRFollowupNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRFollowupNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
