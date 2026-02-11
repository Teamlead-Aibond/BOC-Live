import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCaseUpdatepartLocationComponent } from './bulk-case-updatepart-location.component';

describe('BulkCaseUpdatepartLocationComponent', () => {
  let component: BulkCaseUpdatepartLocationComponent;
  let fixture: ComponentFixture<BulkCaseUpdatepartLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCaseUpdatepartLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCaseUpdatepartLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
