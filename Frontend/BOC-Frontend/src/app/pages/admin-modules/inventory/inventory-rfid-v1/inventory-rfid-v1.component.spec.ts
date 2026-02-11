import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRfidV1Component } from './inventory-rfid-v1.component';

describe('InventoryRfidV1Component', () => {
  let component: InventoryRfidV1Component;
  let fixture: ComponentFixture<InventoryRfidV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRfidV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRfidV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
