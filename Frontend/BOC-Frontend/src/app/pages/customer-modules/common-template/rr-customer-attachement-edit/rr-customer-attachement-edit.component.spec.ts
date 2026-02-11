import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrCustomerAttachementEditComponent } from './rr-customer-attachement-edit.component';

describe('RrCustomerAttachementEditComponent', () => {
  let component: RrCustomerAttachementEditComponent;
  let fixture: ComponentFixture<RrCustomerAttachementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrCustomerAttachementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrCustomerAttachementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
