import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRfidDashboardV1Component } from './inventory-rfid-dashboard-v1.component';

describe('InventoryRfidDashboardV1Component', () => {
  let component: InventoryRfidDashboardV1Component;
  let fixture: ComponentFixture<InventoryRfidDashboardV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRfidDashboardV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRfidDashboardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
