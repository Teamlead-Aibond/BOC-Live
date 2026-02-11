import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedMroComponent } from './rejected-mro.component';

describe('RejectedMroComponent', () => {
  let component: RejectedMroComponent;
  let fixture: ComponentFixture<RejectedMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
