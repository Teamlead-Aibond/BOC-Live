import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutListComponent } from './stock-out-list.component';

describe('StockOutListComponent', () => {
  let component: StockOutListComponent;
  let fixture: ComponentFixture<StockOutListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOutListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
