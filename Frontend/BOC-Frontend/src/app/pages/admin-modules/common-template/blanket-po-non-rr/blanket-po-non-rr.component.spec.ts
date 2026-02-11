import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoNonRrComponent } from './blanket-po-non-rr.component';

describe('BlanketPoNonRrComponent', () => {
  let component: BlanketPoNonRrComponent;
  let fixture: ComponentFixture<BlanketPoNonRrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoNonRrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoNonRrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
