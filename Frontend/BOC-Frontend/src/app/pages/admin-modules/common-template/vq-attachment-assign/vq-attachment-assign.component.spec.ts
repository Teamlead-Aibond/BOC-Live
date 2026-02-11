import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VQAttachmentAssignComponent } from './vq-attachment-assign.component';

describe('VQAttachmentAssignComponent', () => {
  let component: VQAttachmentAssignComponent;
  let fixture: ComponentFixture<VQAttachmentAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VQAttachmentAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VQAttachmentAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
