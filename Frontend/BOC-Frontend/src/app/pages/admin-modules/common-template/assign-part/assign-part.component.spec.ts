import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPartComponent } from './assign-part.component';

describe('AssignPartComponent', () => {
  let component: AssignPartComponent;
  let fixture: ComponentFixture<AssignPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
