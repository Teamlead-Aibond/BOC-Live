import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertHistoryComponent } from './revert-history.component';

describe('RevertHistoryComponent', () => {
  let component: RevertHistoryComponent;
  let fixture: ComponentFixture<RevertHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevertHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
