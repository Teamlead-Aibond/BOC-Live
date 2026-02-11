import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteDuplicateComponent } from './quote-duplicate.component';

describe('QuoteDuplicateComponent', () => {
  let component: QuoteDuplicateComponent;
  let fixture: ComponentFixture<QuoteDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
