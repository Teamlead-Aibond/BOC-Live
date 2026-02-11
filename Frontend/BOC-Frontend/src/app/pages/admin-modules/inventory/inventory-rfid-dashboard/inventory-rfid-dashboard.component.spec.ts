import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRfidDashboardComponent } from './inventory-rfid-dashboard.component';

describe('InventoryRfidDashboardComponent', () => {
  let component: InventoryRfidDashboardComponent;
  let fixture: ComponentFixture<InventoryRfidDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRfidDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRfidDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
