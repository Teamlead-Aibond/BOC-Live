import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCaseShipComponent } from './bulk-case-ship.component';

describe('BulkCaseShipComponent', () => {
  let component: BulkCaseShipComponent;
  let fixture: ComponentFixture<BulkCaseShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCaseShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCaseShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
