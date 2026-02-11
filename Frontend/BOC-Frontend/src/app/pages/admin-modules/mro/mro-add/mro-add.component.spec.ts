import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroAddComponent } from './mro-add.component';

describe('MroAddComponent', () => {
  let component: MroAddComponent;
  let fixture: ComponentFixture<MroAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
