import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalnketPoMroComponent } from './balnket-po-mro.component';

describe('BalnketPoMroComponent', () => {
  let component: BalnketPoMroComponent;
  let fixture: ComponentFixture<BalnketPoMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalnketPoMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalnketPoMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
