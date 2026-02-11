import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerRefCustomerportalComponent } from './edit-customer-ref-customerportal.component';

describe('EditCustomerRefCustomerportalComponent', () => {
  let component: EditCustomerRefCustomerportalComponent;
  let fixture: ComponentFixture<EditCustomerRefCustomerportalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerRefCustomerportalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerRefCustomerportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
