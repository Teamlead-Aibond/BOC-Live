import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrCurrentHistoryComponent } from './rr-current-history.component';

describe('RrCurrentHistoryComponent', () => {
  let component: RrCurrentHistoryComponent;
  let fixture: ComponentFixture<RrCurrentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrCurrentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrCurrentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
