import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersMapComponent } from './players-map.component';

describe('PlayersMapComponent', () => {
  let component: PlayersMapComponent;
  let fixture: ComponentFixture<PlayersMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
