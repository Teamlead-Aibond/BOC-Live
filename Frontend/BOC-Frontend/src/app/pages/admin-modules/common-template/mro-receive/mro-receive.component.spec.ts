import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroReceiveComponent } from './mro-receive.component';

describe('MroReceiveComponent', () => {
  let component: MroReceiveComponent;
  let fixture: ComponentFixture<MroReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
