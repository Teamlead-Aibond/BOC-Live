import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrEditAttachmentComponent } from './rr-edit-attachment.component';

describe('RrEditAttachmentComponent', () => {
  let component: RrEditAttachmentComponent;
  let fixture: ComponentFixture<RrEditAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrEditAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrEditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
