import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlanketPoCustomerPortalComponent } from './blanket-po-customer-portal.component';

describe('BlanketPoCustomerPortalComponent', () => {
  let component: BlanketPoCustomerPortalComponent;
  let fixture: ComponentFixture<BlanketPoCustomerPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlanketPoCustomerPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlanketPoCustomerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
