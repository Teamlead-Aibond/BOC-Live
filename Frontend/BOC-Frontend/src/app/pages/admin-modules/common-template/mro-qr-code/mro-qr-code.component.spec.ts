import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroQrCodeComponent } from './mro-qr-code.component';

describe('MroQrCodeComponent', () => {
  let component: MroQrCodeComponent;
  let fixture: ComponentFixture<MroQrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroQrCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
