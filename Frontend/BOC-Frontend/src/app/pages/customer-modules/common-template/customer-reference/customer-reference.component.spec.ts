import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReferenceComponent } from './customer-reference.component';

describe('CustomerReferenceComponent', () => {
  let component: CustomerReferenceComponent;
  let fixture: ComponentFixture<CustomerReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
