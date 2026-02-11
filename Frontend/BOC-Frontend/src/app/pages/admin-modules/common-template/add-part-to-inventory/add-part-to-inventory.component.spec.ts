import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartToInventoryComponent } from './add-part-to-inventory.component';

describe('AddPartToInventoryComponent', () => {
  let component: AddPartToInventoryComponent;
  let fixture: ComponentFixture<AddPartToInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPartToInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartToInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
