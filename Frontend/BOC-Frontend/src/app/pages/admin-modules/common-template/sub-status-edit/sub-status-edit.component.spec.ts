import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStatusEditComponent } from './sub-status-edit.component';

describe('SubStatusEditComponent', () => {
  let component: SubStatusEditComponent;
  let fixture: ComponentFixture<SubStatusEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubStatusEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubStatusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
