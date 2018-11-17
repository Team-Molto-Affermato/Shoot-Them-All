import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs/Subscription';
import {ConditionUpdaterService} from "../services/condition-updater.service";
import {RoleHelper} from "../models/RoleHelper";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  stockQuote: number;
  sub: Subscription;

  constructor(private dataService: DataService,
              private conditionObserverService: ConditionUpdaterService) { }

  ngOnInit() {
    RoleHelper.initialize();
    this.conditionObserverService.init();
    this.sub = this.dataService.getQuotes()
      .subscribe(quote => {
        this.stockQuote = quote;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
