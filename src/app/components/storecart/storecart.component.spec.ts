import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorecartComponent } from './storecart.component';

describe('StorecartComponent', () => {
  let component: StorecartComponent;
  let fixture: ComponentFixture<StorecartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorecartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorecartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
