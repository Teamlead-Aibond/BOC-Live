import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrEditPartLocationComponent } from './rr-edit-part-location.component';

describe('RrEditPartLocationComponent', () => {
  let component: RrEditPartLocationComponent;
  let fixture: ComponentFixture<RrEditPartLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrEditPartLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrEditPartLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
