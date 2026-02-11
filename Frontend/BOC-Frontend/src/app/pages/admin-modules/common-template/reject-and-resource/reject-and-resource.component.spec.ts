import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectAndResourceComponent } from './reject-and-resource.component';

describe('RejectAndResourceComponent', () => {
  let component: RejectAndResourceComponent;
  let fixture: ComponentFixture<RejectAndResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectAndResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectAndResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
