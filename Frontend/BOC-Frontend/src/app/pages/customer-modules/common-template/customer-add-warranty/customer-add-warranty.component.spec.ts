import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddWarrantyComponent } from './customer-add-warranty.component';

describe('CustomerAddWarrantyComponent', () => {
  let component: CustomerAddWarrantyComponent;
  let fixture: ComponentFixture<CustomerAddWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
