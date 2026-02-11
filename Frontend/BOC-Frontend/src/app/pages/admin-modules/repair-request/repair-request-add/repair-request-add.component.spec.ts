import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestAddComponent } from './repair-request-add.component';

describe('RepairRequestAddComponent', () => {
  let component: RepairRequestAddComponent;
  let fixture: ComponentFixture<RepairRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
