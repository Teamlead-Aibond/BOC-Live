import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoInsoComponent } from './create-po-inso.component';

describe('CreatePoInsoComponent', () => {
  let component: CreatePoInsoComponent;
  let fixture: ComponentFixture<CreatePoInsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePoInsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePoInsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
