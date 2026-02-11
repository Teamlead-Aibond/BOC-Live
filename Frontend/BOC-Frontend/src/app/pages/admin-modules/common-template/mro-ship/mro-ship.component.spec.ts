import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroShipComponent } from './mro-ship.component';

describe('MroShipComponent', () => {
  let component: MroShipComponent;
  let fixture: ComponentFixture<MroShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
