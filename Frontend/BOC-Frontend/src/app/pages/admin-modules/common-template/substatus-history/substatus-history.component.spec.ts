import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstatusHistoryComponent } from './substatus-history.component';

describe('SubstatusHistoryComponent', () => {
  let component: SubstatusHistoryComponent;
  let fixture: ComponentFixture<SubstatusHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstatusHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
