import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndentComponent } from './create-indent.component';

describe('CreateIndentComponent', () => {
  let component: CreateIndentComponent;
  let fixture: ComponentFixture<CreateIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
