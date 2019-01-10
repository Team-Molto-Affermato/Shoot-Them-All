import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfoMapComponent } from './match-info-map.component';

describe('MatchInfoMapComponent', () => {
  let component: MatchInfoMapComponent;
  let fixture: ComponentFixture<MatchInfoMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchInfoMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchInfoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
