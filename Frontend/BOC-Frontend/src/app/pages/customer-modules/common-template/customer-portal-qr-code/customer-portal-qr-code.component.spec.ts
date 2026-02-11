import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPortalQrCodeComponent } from './customer-portal-qr-code.component';

describe('CustomerPortalQrCodeComponent', () => {
  let component: CustomerPortalQrCodeComponent;
  let fixture: ComponentFixture<CustomerPortalQrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPortalQrCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPortalQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
