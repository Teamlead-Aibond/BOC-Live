import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarrantyComponent } from './add-warranty.component';

describe('AddWarrantyComponent', () => {
  let component: AddWarrantyComponent;
  let fixture: ComponentFixture<AddWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWarrantyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
