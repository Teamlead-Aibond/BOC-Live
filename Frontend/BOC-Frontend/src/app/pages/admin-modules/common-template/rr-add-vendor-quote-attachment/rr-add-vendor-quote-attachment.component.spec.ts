import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RRAddVendorQuoteAttachmentComponent } from './rr-add-vendor-quote-attachment.component';

describe('RRAddVendorQuoteAttachmentComponent', () => {
  let component: RRAddVendorQuoteAttachmentComponent;
  let fixture: ComponentFixture<RRAddVendorQuoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RRAddVendorQuoteAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RRAddVendorQuoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
