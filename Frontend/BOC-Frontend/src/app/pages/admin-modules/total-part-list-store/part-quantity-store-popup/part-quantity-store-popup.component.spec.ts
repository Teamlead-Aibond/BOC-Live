import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartQuantityStorePopupComponent } from './part-quantity-store-popup.component';

describe('PartQuantityStorePopupComponent', () => {
  let component: PartQuantityStorePopupComponent;
  let fixture: ComponentFixture<PartQuantityStorePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartQuantityStorePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartQuantityStorePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
