import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSubstatusAssignEditComponent } from './bulk-substatus-assign-edit.component';

describe('BulkSubstatusAssignEditComponent', () => {
  let component: BulkSubstatusAssignEditComponent;
  let fixture: ComponentFixture<BulkSubstatusAssignEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkSubstatusAssignEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSubstatusAssignEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
