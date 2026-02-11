import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignPartsComponent } from './edit-assign-parts.component';

describe('EditAssignPartsComponent', () => {
  let component: EditAssignPartsComponent;
  let fixture: ComponentFixture<EditAssignPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssignPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssignPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
