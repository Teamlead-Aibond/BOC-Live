import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRefQrCodeComponent } from './customer-ref-qr-code.component';

describe('CustomerRefQrCodeComponent', () => {
  let component: CustomerRefQrCodeComponent;
  let fixture: ComponentFixture<CustomerRefQrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRefQrCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRefQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
