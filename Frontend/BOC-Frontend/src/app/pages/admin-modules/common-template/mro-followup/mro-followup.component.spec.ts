import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroFollowupComponent } from './mro-followup.component';

describe('MroFollowupComponent', () => {
  let component: MroFollowupComponent;
  let fixture: ComponentFixture<MroFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
