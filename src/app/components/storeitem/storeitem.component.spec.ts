import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreitemComponent } from './storeitem.component';

describe('StoreitemComponent', () => {
  let component: StoreitemComponent;
  let fixture: ComponentFixture<StoreitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
