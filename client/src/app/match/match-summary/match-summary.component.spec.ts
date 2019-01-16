import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSummaryComponent } from './match-summary.component';

describe('MatchSummaryComponent', () => {
  let component: MatchSummaryComponent;
  let fixture: ComponentFixture<MatchSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
