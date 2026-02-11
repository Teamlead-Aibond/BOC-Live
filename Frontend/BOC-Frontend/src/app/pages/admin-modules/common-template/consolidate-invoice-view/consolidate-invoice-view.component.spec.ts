import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidateInvoiceViewComponent } from './consolidate-invoice-view.component';

describe('ConsolidateInvoiceViewComponent', () => {
  let component: ConsolidateInvoiceViewComponent;
  let fixture: ComponentFixture<ConsolidateInvoiceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidateInvoiceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidateInvoiceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
