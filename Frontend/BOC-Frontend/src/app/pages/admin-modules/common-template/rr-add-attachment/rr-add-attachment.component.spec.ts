import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRAddAttachmentComponent } from './rr-add-attachment.component';

describe('RRAddAttachmentComponent', () => {
  let component: RRAddAttachmentComponent;
  let fixture: ComponentFixture<RRAddAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRAddAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRAddAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
