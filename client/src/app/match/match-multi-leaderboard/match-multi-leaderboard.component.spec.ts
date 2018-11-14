import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchMultiLeaderboardComponent } from './match-multi-leaderboard.component';

describe('MatchMultiLeaderboardComponent', () => {
  let component: MatchMultiLeaderboardComponent;
  let fixture: ComponentFixture<MatchMultiLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchMultiLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchMultiLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
