import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRCustomerAttachmentComponent } from './rr-customer-attachment.component';

describe('RRCustomerAttachmentComponent', () => {
  let component: RRCustomerAttachmentComponent;
  let fixture: ComponentFixture<RRCustomerAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRCustomerAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRCustomerAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
