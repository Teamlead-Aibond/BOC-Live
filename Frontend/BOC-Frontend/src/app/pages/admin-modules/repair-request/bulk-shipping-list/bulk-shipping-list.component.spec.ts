import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkShippingListComponent } from './bulk-shipping-list.component';

describe('BulkShippingListComponent', () => {
  let component: BulkShippingListComponent;
  let fixture: ComponentFixture<BulkShippingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkShippingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkShippingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
