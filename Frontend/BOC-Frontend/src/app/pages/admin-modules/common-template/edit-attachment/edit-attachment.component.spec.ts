import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttachmentComponent } from './edit-attachment.component';

describe('EditAttachmentComponent', () => {
  let component: EditAttachmentComponent;
  let fixture: ComponentFixture<EditAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
