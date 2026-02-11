import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroDuplicateComponent } from './mro-duplicate.component';

describe('MroDuplicateComponent', () => {
  let component: MroDuplicateComponent;
  let fixture: ComponentFixture<MroDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
