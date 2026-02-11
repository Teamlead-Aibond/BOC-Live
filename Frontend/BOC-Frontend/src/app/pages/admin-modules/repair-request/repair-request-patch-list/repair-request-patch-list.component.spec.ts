import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequesPatchtListComponent } from './repair-request-patch-list.component';

describe('RepairRequesPatchtListComponent', () => {
  let component: RepairRequesPatchtListComponent;
  let fixture: ComponentFixture<RepairRequesPatchtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequesPatchtListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequesPatchtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
