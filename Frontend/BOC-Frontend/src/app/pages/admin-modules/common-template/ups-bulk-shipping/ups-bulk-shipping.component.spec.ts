import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsBulkShippingComponent } from './ups-bulk-shipping.component';

describe('UpsBulkShippingComponent', () => {
  let component: UpsBulkShippingComponent;
  let fixture: ComponentFixture<UpsBulkShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsBulkShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsBulkShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
