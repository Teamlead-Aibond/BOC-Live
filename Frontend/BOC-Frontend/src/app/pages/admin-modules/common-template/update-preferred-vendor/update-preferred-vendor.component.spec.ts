import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePreferredVendorComponent } from './update-preferred-vendor.component';

describe('UpdatePreferredVendorComponent', () => {
  let component: UpdatePreferredVendorComponent;
  let fixture: ComponentFixture<UpdatePreferredVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePreferredVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePreferredVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
