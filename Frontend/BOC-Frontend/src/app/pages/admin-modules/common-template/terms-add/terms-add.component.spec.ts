import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAddComponent } from './terms-add.component';

describe('TermsAddComponent', () => {
  let component: TermsAddComponent;
  let fixture: ComponentFixture<TermsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
