import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestWorkchainListComponent } from './repair-request-list.component';

describe('RepairRequestWorkchainListComponent', () => {
  let component: RepairRequestWorkchainListComponent;
  let fixture: ComponentFixture<RepairRequestWorkchainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequestWorkchainListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestWorkchainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
