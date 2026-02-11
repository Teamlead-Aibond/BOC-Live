import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroUpdateCurrentLocationComponent } from './mro-update-current-location.component';

describe('MroUpdateCurrentLocationComponent', () => {
  let component: MroUpdateCurrentLocationComponent;
  let fixture: ComponentFixture<MroUpdateCurrentLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroUpdateCurrentLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroUpdateCurrentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
