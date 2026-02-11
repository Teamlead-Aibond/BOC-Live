import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrReportsComponent } from './rr-reports.component';

describe('RrReportsComponent', () => {
  let component: RrReportsComponent;
  let fixture: ComponentFixture<RrReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
