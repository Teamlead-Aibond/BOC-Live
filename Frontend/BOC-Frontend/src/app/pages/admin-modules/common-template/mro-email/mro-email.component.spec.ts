import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MroEmailComponent } from './mro-email.component';

describe('MroEmailComponent', () => {
  let component: MroEmailComponent;
  let fixture: ComponentFixture<MroEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MroEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MroEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
