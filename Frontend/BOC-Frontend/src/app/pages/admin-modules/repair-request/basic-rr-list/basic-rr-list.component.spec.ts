import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicRrListComponent } from './basic-rr-list.component';

describe('BasicRrListComponent', () => {
  let component: BasicRrListComponent;
  let fixture: ComponentFixture<BasicRrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicRrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicRrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
