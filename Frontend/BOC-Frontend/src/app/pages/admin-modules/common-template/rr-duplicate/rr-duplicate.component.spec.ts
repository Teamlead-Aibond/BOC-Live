import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrDuplicateComponent } from './rr-duplicate.component';

describe('RrDuplicateComponent', () => {
  let component: RrDuplicateComponent;
  let fixture: ComponentFixture<RrDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
