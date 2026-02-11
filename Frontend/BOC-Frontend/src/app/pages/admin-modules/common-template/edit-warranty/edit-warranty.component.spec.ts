import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWarrantyComponent } from './edit-warranty.component';

describe('EditWarrantyComponent', () => {
  let component: EditWarrantyComponent;
  let fixture: ComponentFixture<EditWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
