import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrShippingHistoryComponent } from './rr-shipping-history.component';

describe('RrShippingHistoryComponent', () => {
  let component: RrShippingHistoryComponent;
  let fixture: ComponentFixture<RrShippingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrShippingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrShippingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
