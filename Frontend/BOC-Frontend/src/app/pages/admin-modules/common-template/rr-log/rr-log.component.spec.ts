import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrLogComponent } from './rr-log.component';

describe('RrLogComponent', () => {
  let component: RrLogComponent;
  let fixture: ComponentFixture<RrLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
