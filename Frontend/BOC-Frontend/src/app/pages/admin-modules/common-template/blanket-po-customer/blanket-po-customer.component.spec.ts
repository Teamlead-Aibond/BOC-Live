import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoCustomerComponent } from './blanket-po-customer.component';

describe('BlanketPoCustomerComponent', () => {
  let component: BlanketPoCustomerComponent;
  let fixture: ComponentFixture<BlanketPoCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
