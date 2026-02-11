import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuoteAttachmentComponent } from './vendor-quote-attachment.component';

describe('VendorQuoteAttachmentComponent', () => {
  let component: VendorQuoteAttachmentComponent;
  let fixture: ComponentFixture<VendorQuoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorQuoteAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
