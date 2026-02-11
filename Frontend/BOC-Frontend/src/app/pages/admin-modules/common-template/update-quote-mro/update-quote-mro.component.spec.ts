import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuoteMroComponent } from './update-quote-mro.component';

describe('UpdateQuoteMroComponent', () => {
  let component: UpdateQuoteMroComponent;
  let fixture: ComponentFixture<UpdateQuoteMroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateQuoteMroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQuoteMroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
