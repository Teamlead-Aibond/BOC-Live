import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsPickedupComponent } from './parts-pickedup.component';

describe('PartsPickedupComponent', () => {
  let component: PartsPickedupComponent;
  let fixture: ComponentFixture<PartsPickedupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsPickedupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsPickedupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
