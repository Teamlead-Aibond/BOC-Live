/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyExchangeRateListComponent } from './currency-exchange-rate-list.component';

describe('CurrencyExchangeRateListComponent', () => {
  let component: CurrencyExchangeRateListComponent;
  let fixture: ComponentFixture<CurrencyExchangeRateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyExchangeRateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyExchangeRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
