import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyViewComponent } from './warranty-view.component';

describe('WarrantyViewComponent', () => {
  let component: WarrantyViewComponent;
  let fixture: ComponentFixture<WarrantyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
