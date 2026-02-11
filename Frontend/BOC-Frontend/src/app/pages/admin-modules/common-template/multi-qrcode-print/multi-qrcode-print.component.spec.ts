import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiQrcodePrintComponent } from './multi-qrcode-print.component';

describe('MultiQrcodePrintComponent', () => {
  let component: MultiQrcodePrintComponent;
  let fixture: ComponentFixture<MultiQrcodePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiQrcodePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiQrcodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
