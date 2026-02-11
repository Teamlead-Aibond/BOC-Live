import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerReferenceComponent } from './edit-customer-reference.component';

describe('EditCustomerReferenceComponent', () => {
  let component: EditCustomerReferenceComponent;
  let fixture: ComponentFixture<EditCustomerReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCustomerReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
