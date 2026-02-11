import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AhNewDashboardComponent } from './ah-new-dashboard.component';

describe('AhNewDashboardComponent', () => {
  let component: AhNewDashboardComponent;
  let fixture: ComponentFixture<AhNewDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AhNewDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AhNewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
