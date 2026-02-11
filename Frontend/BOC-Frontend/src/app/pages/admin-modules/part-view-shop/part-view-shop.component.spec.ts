/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartViewShopComponent } from './part-view-shop.component';

describe('PartViewShopComponent', () => {
  let component: PartViewShopComponent;
  let fixture: ComponentFixture<PartViewShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartViewShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartViewShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
