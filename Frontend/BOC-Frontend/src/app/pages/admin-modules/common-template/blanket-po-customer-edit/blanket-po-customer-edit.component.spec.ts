import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoCustomerEditComponent } from './blanket-po-customer-edit.component';

describe('BlanketPoCustomerEditComponent', () => {
  let component: BlanketPoCustomerEditComponent;
  let fixture: ComponentFixture<BlanketPoCustomerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoCustomerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoCustomerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
