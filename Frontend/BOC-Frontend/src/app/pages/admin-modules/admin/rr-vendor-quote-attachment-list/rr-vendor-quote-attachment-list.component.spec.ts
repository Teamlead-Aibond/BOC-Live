import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrVendorQuoteAttachmentListComponent } from './rr-vendor-quote-attachment-list.component';

describe('RrVendorQuoteAttachmentListComponent', () => {
  let component: RrVendorQuoteAttachmentListComponent;
  let fixture: ComponentFixture<RrVendorQuoteAttachmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrVendorQuoteAttachmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrVendorQuoteAttachmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
