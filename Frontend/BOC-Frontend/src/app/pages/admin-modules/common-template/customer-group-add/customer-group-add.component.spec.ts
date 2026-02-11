import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerGroupAddComponent } from './customer-group-add.component';

describe('CustomerGroupAddComponent', () => {
  let component: CustomerGroupAddComponent;
  let fixture: ComponentFixture<CustomerGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
