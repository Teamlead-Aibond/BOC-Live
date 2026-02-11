import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsIntegrationComponent } from './ups-integration.component';

describe('UpsIntegrationComponent', () => {
  let component: UpsIntegrationComponent;
  let fixture: ComponentFixture<UpsIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
