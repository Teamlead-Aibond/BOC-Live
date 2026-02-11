import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroShipReceiveComponent } from './mro-ship-receive.component';

describe('MroShipReceiveComponent', () => {
  let component: MroShipReceiveComponent;
  let fixture: ComponentFixture<MroShipReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroShipReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroShipReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
