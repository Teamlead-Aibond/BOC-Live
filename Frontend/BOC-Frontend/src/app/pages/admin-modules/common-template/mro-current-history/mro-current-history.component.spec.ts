import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroCurrentHistoryComponent } from './mro-current-history.component';

describe('MroCurrentHistoryComponent', () => {
  let component: MroCurrentHistoryComponent;
  let fixture: ComponentFixture<MroCurrentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroCurrentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroCurrentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
