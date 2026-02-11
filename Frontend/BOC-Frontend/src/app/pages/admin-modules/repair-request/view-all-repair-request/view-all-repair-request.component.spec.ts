import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRepairRequestComponent } from './view-all-repair-request.component';

describe('ViewAllRepairRequestComponent', () => {
  let component: ViewAllRepairRequestComponent;
  let fixture: ComponentFixture<ViewAllRepairRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllRepairRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllRepairRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
