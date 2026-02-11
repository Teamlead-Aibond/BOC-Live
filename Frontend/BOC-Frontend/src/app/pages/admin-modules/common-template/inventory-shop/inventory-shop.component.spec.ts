import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryShopComponent } from './inventory-shop.component';

describe('InventoryShopComponent', () => {
  let component: InventoryShopComponent;
  let fixture: ComponentFixture<InventoryShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
