import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroEditComponent } from './mro-edit.component';

describe('MroEditComponent', () => {
  let component: MroEditComponent;
  let fixture: ComponentFixture<MroEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
