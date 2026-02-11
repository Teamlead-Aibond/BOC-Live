import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCurrencyComponent } from './multi-currency.component';

describe('MultiCurrencyComponent', () => {
  let component: MultiCurrencyComponent;
  let fixture: ComponentFixture<MultiCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
