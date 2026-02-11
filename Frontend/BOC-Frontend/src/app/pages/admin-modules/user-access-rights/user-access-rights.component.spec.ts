import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessRightsComponent } from './user-access-rights.component';

describe('UserAccessRightsComponent', () => {
  let component: UserAccessRightsComponent;
  let fixture: ComponentFixture<UserAccessRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccessRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
