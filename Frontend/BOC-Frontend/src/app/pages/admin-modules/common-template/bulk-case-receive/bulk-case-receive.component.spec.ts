import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCaseReceiveComponent } from './bulk-case-receive.component';

describe('BulkCaseReceiveComponent', () => {
  let component: BulkCaseReceiveComponent;
  let fixture: ComponentFixture<BulkCaseReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCaseReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCaseReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
