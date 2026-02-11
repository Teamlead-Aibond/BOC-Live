import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuoteComponent } from './vendor-quote.component';

describe('VendorQuoteComponent', () => {
  let component: VendorQuoteComponent;
  let fixture: ComponentFixture<VendorQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
