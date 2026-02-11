import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTrackingNewComponent } from './part-tracking-new.component';

describe('PartTrackingNewComponent', () => {
  let component: PartTrackingNewComponent;
  let fixture: ComponentFixture<PartTrackingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartTrackingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartTrackingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
