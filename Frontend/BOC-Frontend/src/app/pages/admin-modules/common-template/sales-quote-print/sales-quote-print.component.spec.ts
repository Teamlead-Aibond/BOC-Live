import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesQuotePrintComponent } from './sales-quote-print.component';

describe('SalesQuotePrintComponent', () => {
  let component: SalesQuotePrintComponent;
  let fixture: ComponentFixture<SalesQuotePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesQuotePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesQuotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
