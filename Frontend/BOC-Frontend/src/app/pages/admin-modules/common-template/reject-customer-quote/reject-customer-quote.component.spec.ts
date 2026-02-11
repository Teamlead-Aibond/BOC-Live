import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectCustomerQuoteComponent } from './reject-customer-quote.component';

describe('RejectCustomerQuoteComponent', () => {
  let component: RejectCustomerQuoteComponent;
  let fixture: ComponentFixture<RejectCustomerQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectCustomerQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectCustomerQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
