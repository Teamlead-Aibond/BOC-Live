import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhDashboardComponent } from './ah-dashboard.component';

describe('AhDashboardComponent', () => {
  let component: AhDashboardComponent;
  let fixture: ComponentFixture<AhDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AhDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
