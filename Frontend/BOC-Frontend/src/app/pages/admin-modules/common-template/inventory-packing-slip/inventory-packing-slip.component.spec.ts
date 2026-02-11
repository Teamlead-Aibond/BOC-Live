import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPackingSlipComponent } from './inventory-packing-slip.component';

describe('InventoryPackingSlipComponent', () => {
  let component: InventoryPackingSlipComponent;
  let fixture: ComponentFixture<InventoryPackingSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryPackingSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPackingSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
