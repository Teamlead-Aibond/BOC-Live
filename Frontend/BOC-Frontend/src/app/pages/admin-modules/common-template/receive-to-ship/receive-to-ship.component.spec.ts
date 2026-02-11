import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveToShipComponent } from './receive-to-ship.component';

describe('ReceiveToShipComponent', () => {
  let component: ReceiveToShipComponent;
  let fixture: ComponentFixture<ReceiveToShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveToShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveToShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
