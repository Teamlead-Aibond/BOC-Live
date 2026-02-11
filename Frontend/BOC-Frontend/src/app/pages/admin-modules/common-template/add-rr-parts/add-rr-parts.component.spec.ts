import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRrPartsComponent } from './add-rr-parts.component';

describe('AddRrPartsComponent', () => {
  let component: AddRrPartsComponent;
  let fixture: ComponentFixture<AddRrPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRrPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRrPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
