import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerQuoteComponent } from './customer-quote.component';

describe('CustomerQuoteComponent', () => {
  let component: CustomerQuoteComponent;
  let fixture: ComponentFixture<CustomerQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
