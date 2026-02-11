import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageAddComponent } from './damage-add.component';

describe('DamageAddComponent', () => {
  let component: DamageAddComponent;
  let fixture: ComponentFixture<DamageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
