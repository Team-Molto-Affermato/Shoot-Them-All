import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicMatchInfoComponent } from './basic-match-info.component';

describe('BasicMatchInfoComponent', () => {
  let component: BasicMatchInfoComponent;
  let fixture: ComponentFixture<BasicMatchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicMatchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicMatchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
