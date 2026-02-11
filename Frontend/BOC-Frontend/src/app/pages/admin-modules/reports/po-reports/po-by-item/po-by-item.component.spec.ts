import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoByItemComponent } from './po-by-item.component';

describe('PoByItemComponent', () => {
  let component: PoByItemComponent;
  let fixture: ComponentFixture<PoByItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoByItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoByItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
