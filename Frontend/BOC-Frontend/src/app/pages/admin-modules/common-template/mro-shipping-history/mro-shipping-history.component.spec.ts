import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroShippingHistoryComponent } from './mro-shipping-history.component';

describe('MroShippingHistoryComponent', () => {
  let component: MroShippingHistoryComponent;
  let fixture: ComponentFixture<MroShippingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroShippingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroShippingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
