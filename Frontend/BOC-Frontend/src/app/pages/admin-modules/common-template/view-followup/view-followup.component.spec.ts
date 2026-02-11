import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFollowupComponent } from './view-followup.component';

describe('ViewFollowupComponent', () => {
  let component: ViewFollowupComponent;
  let fixture: ComponentFixture<ViewFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
