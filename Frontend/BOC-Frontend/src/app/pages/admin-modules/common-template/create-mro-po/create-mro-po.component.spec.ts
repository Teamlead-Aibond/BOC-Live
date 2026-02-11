import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMroPoComponent } from './create-mro-po.component';

describe('CreateMroPoComponent', () => {
  let component: CreateMroPoComponent;
  let fixture: ComponentFixture<CreateMroPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMroPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMroPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
