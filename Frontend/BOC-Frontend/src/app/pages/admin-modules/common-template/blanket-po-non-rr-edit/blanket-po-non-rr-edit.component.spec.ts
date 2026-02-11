import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoNonRrEditComponent } from './blanket-po-non-rr-edit.component';

describe('BlanketPoNonRrEditComponent', () => {
  let component: BlanketPoNonRrEditComponent;
  let fixture: ComponentFixture<BlanketPoNonRrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoNonRrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoNonRrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
