import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestStageComponent } from './repair-request-stage.component';

describe('RepairRequestStageComponent', () => {
  let component: RepairRequestStageComponent;
  let fixture: ComponentFixture<RepairRequestStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequestStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
