import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeLoopComponent } from './qr-code-loop.component';

describe('QrCodeLoopComponent', () => {
  let component: QrCodeLoopComponent;
  let fixture: ComponentFixture<QrCodeLoopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrCodeLoopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeLoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
