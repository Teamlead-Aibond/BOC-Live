import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartLocationHistoryComponent } from './part-location-history.component';

describe('PartLocationHistoryComponent', () => {
  let component: PartLocationHistoryComponent;
  let fixture: ComponentFixture<PartLocationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartLocationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartLocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
