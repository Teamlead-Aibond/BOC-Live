import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRrSubStatusComponent } from './manage-rr-sub-status.component';

describe('ManageRrSubStatusComponent', () => {
  let component: ManageRrSubStatusComponent;
  let fixture: ComponentFixture<ManageRrSubStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRrSubStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRrSubStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
