/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsEditShopComponent } from './parts-edit-shop.component';

describe('PartsEditShopComponent', () => {
  let component: PartsEditShopComponent;
  let fixture: ComponentFixture<PartsEditShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsEditShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsEditShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
