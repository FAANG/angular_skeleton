import { Injectable, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import AggregationServiceInterface from '../aggregation/aggregation-service.interface';

interface QueryParams {
  [key: string]: any;
}

interface Filter {
  [key: string]: any[];
}

@Injectable({
  providedIn: 'root',
})
export class FilterStateService implements OnInit, OnChanges {
  @Input() aggregationService!: AggregationServiceInterface;

  private filtersSubject = new BehaviorSubject<any>({});
  filtersChanged = this.filtersSubject.asObservable();

  constructor(private router: Router) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('aggregationService' in changes && !this.aggregationService) {
      throw new Error('aggregationService is required');
    }
  }

  updateUrlParams(queryObj: QueryParams, componentRoute: any[]): Subscription {
    return this.aggregationService.field.subscribe((data: any) => {
      const params: { [key: string]: any } = Object.keys(data).reduce((acc, key) => {
        if (data[key] && data[key].length !== 0) {
          acc[key] = data[key];
        }
        return acc;
      }, {} as { [key: string]: any });

      if (queryObj['sort']) {
        params['sortTerm'] = queryObj['sort'][0];
        params['sortDirection'] = queryObj['sort'][1];
      }

      this.router.navigate(componentRoute, {
        queryParams: params,
        replaceUrl: true,
        skipLocationChange: false,
      });
    });
  }

  setUpAggregationFilters(params: QueryParams): Filter {
    const filters: Filter = {};

    Object.keys(params).forEach(key => {
      if (['sortTerm', 'sortDirection', 'pageIndex'].includes(key)) return;

      const values: any[] = Array.isArray(params[key]) ? params[key] : [params[key]];
      filters[key] = values;

      values.forEach((value: any) => {
        this.aggregationService.current_active_filters.push(value);
        (this.aggregationService.active_filters as any)[key].push(value);
      });
    });

    this.aggregationService.field.next(this.aggregationService.active_filters);
    this.filtersSubject.next(filters);
    return filters;
  }

  resetFilter() {
    Object.keys(this.aggregationService.active_filters).forEach(key => {
      (this.aggregationService.active_filters as any)[key] = [];
    });
    this.aggregationService.current_active_filters = [];
    this.filtersSubject.next({});
  }
}
