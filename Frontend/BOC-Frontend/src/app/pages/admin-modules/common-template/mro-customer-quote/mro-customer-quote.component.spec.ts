import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroCustomerQuoteComponent } from './mro-customer-quote.component';

describe('MroCustomerQuoteComponent', () => {
  let component: MroCustomerQuoteComponent;
  let fixture: ComponentFixture<MroCustomerQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroCustomerQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroCustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
