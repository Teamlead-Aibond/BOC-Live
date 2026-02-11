import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePartCurrentLocationComponent } from './update-part-current-location.component';

describe('UpdatePartCurrentLocationComponent', () => {
  let component: UpdatePartCurrentLocationComponent;
  let fixture: ComponentFixture<UpdatePartCurrentLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePartCurrentLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePartCurrentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
