import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVendorMroComponent } from './update-vendor-mro.component';

describe('UpdateVendorMroComponent', () => {
  let component: UpdateVendorMroComponent;
  let fixture: ComponentFixture<UpdateVendorMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateVendorMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVendorMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
