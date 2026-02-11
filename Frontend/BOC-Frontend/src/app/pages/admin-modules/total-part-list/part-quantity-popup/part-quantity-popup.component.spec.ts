import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartQuantityPopupComponent } from './part-quantity-popup.component';

describe('PartQuantityPopupComponent', () => {
  let component: PartQuantityPopupComponent;
  let fixture: ComponentFixture<PartQuantityPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartQuantityPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartQuantityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
