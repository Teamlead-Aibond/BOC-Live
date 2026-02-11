import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoInvoiceEditComponent } from './blanket-po-invoice-edit.component';

describe('BlanketPoInvoiceEditComponent', () => {
  let component: BlanketPoInvoiceEditComponent;
  let fixture: ComponentFixture<BlanketPoInvoiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoInvoiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoInvoiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
