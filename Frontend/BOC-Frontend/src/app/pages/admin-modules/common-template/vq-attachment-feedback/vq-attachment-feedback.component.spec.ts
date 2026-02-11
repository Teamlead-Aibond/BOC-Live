import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VQAttachmentFeedbackComponent } from './vq-attachment-feedback.component';

describe('VQAttachmentFeedbackComponent', () => {
  let component: VQAttachmentFeedbackComponent;
  let fixture: ComponentFixture<VQAttachmentFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VQAttachmentFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VQAttachmentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
