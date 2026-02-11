import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRrPartLocationComponent } from './manage-rr-part-location.component';

describe('ManageRrPartLocationComponent', () => {
  let component: ManageRrPartLocationComponent;
  let fixture: ComponentFixture<ManageRrPartLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRrPartLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRrPartLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
