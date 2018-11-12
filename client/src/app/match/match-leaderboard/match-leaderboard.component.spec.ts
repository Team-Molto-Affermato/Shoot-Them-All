import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchLeaderboardComponent } from './match-leaderboard.component';

describe('MatchLeaderboardComponent', () => {
  let component: MatchLeaderboardComponent;
  let fixture: ComponentFixture<MatchLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
