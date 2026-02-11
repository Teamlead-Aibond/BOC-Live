import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyRepairStatusComponent } from './monthly-repair-status.component';

describe('MonthlyRepairStatusComponent', () => {
  let component: MonthlyRepairStatusComponent;
  let fixture: ComponentFixture<MonthlyRepairStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyRepairStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyRepairStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
