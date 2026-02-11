import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeHistoryComponent } from './assignee-history.component';

describe('AssigneeHistoryComponent', () => {
  let component: AssigneeHistoryComponent;
  let fixture: ComponentFixture<AssigneeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigneeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigneeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
