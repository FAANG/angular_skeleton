import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from "rxjs";
import { FilterStateService } from "../services/filter-state.service";
import { TableComponent } from "../shared/table/table.component";
import { AggregationService } from "../services/aggregation.service";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../shared/filter/filter.component";
import { ActiveFilterComponent } from '../shared/active-filter/active-filter.component';
import {HeaderComponent} from "../shared/header/header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        TableComponent,
        FilterComponent,
        ActiveFilterComponent,
        HeaderComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(TableComponent, { static: true }) tableServerComponent: TableComponent | undefined;
  filter_field: any;
  subscriber = { email: '', title: '', indexName: '', indexKey: ''};
  aggrSubscription: Subscription | undefined;

  query = {
    sort: ['id_number', 'desc'],
    _source: [
      'biosampleId',
      'sex',
      'organism',
      'breed',
      'standardMet'
    ],
    search: '',
    filters: {}
  };

  constructor(
      private titleService: Title, private router: Router, private filterStateService: FilterStateService,
      private activatedRoute: ActivatedRoute, private aggregationService: AggregationService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filterStateService.resetFilter();
      this.loadInitialPageState(params);
    });
    if (this.tableServerComponent) {
      this.tableServerComponent.dataUpdate.subscribe((data) => {
        this.aggregationService.getAggregations(data);
      });
      this.tableServerComponent.sortUpdate.subscribe((sortParams) => {
        this.query.sort = sortParams;
      });
    }
    this.aggrSubscription = this.filterStateService.updateUrlParams(this.query, ['dashboard']);
  }

  hasActiveFilters() {
    if (typeof this.filter_field === 'undefined') {
      return false;
    }
    for (const key of Object.keys(this.filter_field)) {
      if (this.filter_field[key].length !== 0) {
        return true;
      }
    }
    return false;
  }

  removeFilter() {
    this.filterStateService.resetFilter();
    this.filter_field = {};
    this.router.navigate(['dashboard'], {queryParams: {}, replaceUrl: true, skipLocationChange: false});
  }

  openSubscriptionDialog() {
    this.subscriber.title = 'Subscribing to dashboard'
  }

  loadInitialPageState(params: any) {
    const filters = this.filterStateService.setUpAggregationFilters(params);

    this.filter_field = filters;
    this.query.filters = filters;
    if (params['sortTerm'] && params['sortDirection']) {
      this.query.sort = [params['sortTerm'], params['sortDirection']];
    }
  }
}
