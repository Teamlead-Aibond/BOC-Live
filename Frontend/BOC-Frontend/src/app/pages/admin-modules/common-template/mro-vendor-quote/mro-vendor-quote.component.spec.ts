import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroVendorQuoteComponent } from './mro-vendor-quote.component';

describe('MroVendorQuoteComponent', () => {
  let component: MroVendorQuoteComponent;
  let fixture: ComponentFixture<MroVendorQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroVendorQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroVendorQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
