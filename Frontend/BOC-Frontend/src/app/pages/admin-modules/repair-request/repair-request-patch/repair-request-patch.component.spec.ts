import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairRequestPatchComponent } from './repair-request-patch.component';

describe('RepairRequestPatchComponent', () => {
  let component: RepairRequestPatchComponent;
  let fixture: ComponentFixture<RepairRequestPatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairRequestPatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairRequestPatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
