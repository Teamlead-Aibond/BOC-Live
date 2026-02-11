import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMroSoComponent } from './create-mro-so.component';

describe('CreateMroSoComponent', () => {
  let component: CreateMroSoComponent;
  let fixture: ComponentFixture<CreateMroSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMroSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMroSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
