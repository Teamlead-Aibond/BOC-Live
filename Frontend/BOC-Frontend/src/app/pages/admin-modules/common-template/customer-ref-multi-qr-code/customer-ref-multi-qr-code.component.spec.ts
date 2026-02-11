import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRefMultiQrCodeComponent } from './customer-ref-multi-qr-code.component';

describe('CustomerRefMultiQrCodeComponent', () => {
  let component: CustomerRefMultiQrCodeComponent;
  let fixture: ComponentFixture<CustomerRefMultiQrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRefMultiQrCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRefMultiQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
