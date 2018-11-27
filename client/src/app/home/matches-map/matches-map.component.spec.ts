import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesMapComponent } from './matches-map.component';

describe('MatchesMapComponent', () => {
  let component: MatchesMapComponent;
  let fixture: ComponentFixture<MatchesMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
