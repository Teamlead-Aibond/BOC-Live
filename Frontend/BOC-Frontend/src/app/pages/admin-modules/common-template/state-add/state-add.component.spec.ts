import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateAddComponent } from './state-add.component';

describe('StateAddComponent', () => {
  let component: StateAddComponent;
  let fixture: ComponentFixture<StateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
