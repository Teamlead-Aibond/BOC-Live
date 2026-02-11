import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrAssigneeEditComponent } from './rr-assignee-edit.component';

describe('RrAssigneeEditComponent', () => {
  let component: RrAssigneeEditComponent;
  let fixture: ComponentFixture<RrAssigneeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrAssigneeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrAssigneeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
