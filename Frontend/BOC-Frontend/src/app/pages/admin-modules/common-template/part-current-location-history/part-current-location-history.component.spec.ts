import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCurrentLocationHistoryComponent } from './part-current-location-history.component';

describe('PartCurrentLocationHistoryComponent', () => {
  let component: PartCurrentLocationHistoryComponent;
  let fixture: ComponentFixture<PartCurrentLocationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartCurrentLocationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartCurrentLocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
