import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoByPartsComponent } from './so-by-parts.component';

describe('SoByPartsComponent', () => {
  let component: SoByPartsComponent;
  let fixture: ComponentFixture<SoByPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoByPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoByPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
