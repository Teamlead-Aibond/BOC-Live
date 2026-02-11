import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceByPartsComponent } from './invoice-by-parts.component';

describe('InvoiceByPartsComponent', () => {
  let component: InvoiceByPartsComponent;
  let fixture: ComponentFixture<InvoiceByPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceByPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceByPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
