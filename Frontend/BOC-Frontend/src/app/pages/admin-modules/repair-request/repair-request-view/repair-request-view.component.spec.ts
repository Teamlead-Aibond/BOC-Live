import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestViewComponent } from './repair-request-view.component';

describe('RepairRequestViewComponent', () => {
  let component: RepairRequestViewComponent;
  let fixture: ComponentFixture<RepairRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
