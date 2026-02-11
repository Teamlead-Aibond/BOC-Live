import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrVendorQuoteAttachmentSelectedListComponent } from './rr-vendor-quote-attachment-selected-list.component';

describe('RrVendorQuoteAttachmentSelectedListComponent', () => {
  let component: RrVendorQuoteAttachmentSelectedListComponent;
  let fixture: ComponentFixture<RrVendorQuoteAttachmentSelectedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrVendorQuoteAttachmentSelectedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrVendorQuoteAttachmentSelectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
