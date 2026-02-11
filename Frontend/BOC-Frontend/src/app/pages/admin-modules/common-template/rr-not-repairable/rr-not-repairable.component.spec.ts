import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrNotRepairableComponent } from './rr-not-repairable.component';

describe('RrNotRepairableComponent', () => {
  let component: RrNotRepairableComponent;
  let fixture: ComponentFixture<RrNotRepairableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrNotRepairableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrNotRepairableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
