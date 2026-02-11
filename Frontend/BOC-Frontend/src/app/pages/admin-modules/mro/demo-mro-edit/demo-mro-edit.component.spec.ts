import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoMroEditComponent } from './demo-mro-edit.component';

describe('DemoMroEditComponent', () => {
  let component: DemoMroEditComponent;
  let fixture: ComponentFixture<DemoMroEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoMroEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoMroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
