import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroAddCustomerQuoteComponent } from './mro-add-customer-quote.component';

describe('MroAddCustomerQuoteComponent', () => {
  let component: MroAddCustomerQuoteComponent;
  let fixture: ComponentFixture<MroAddCustomerQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroAddCustomerQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroAddCustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
