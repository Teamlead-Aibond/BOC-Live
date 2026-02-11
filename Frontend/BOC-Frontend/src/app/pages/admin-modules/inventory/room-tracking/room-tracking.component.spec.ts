import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTrackingComponent } from './room-tracking.component';

describe('RoomTrackingComponent', () => {
  let component: RoomTrackingComponent;
  let fixture: ComponentFixture<RoomTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
