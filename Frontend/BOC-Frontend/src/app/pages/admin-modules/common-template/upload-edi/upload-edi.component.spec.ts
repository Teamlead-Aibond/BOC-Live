import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEDIComponent } from './upload-edi.component';

describe('UploadEDIComponent', () => {
  let component: UploadEDIComponent;
  let fixture: ComponentFixture<UploadEDIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEDIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
