import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsLabelComponent } from './ups-label.component';

describe('UpsLabelComponent', () => {
  let component: UpsLabelComponent;
  let fixture: ComponentFixture<UpsLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
