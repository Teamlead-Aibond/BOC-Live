import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkShippingComponent } from './bulk-shipping.component';

describe('BulkShippingComponent', () => {
  let component: BulkShippingComponent;
  let fixture: ComponentFixture<BulkShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
