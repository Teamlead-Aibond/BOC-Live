import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { viewCFComponent } from './viewCF.component';

describe('viewCFComponent', () => {
  let component: viewCFComponent;
  let fixture: ComponentFixture<viewCFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ viewCFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(viewCFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
