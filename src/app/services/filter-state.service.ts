import { Injectable } from '@angular/core';
import { AggregationService } from "./aggregation.service";
import { Router } from "@angular/router";
import { Subscription, BehaviorSubject } from "rxjs";

interface QueryParams {
  [key: string]: any;
}

interface ActiveFilters {
  sex: string[];
  organism: string[];
  breed: string[];
  standard: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private filtersSubject = new BehaviorSubject<any>({});
  filtersChanged = this.filtersSubject.asObservable();

  constructor(private aggregationService: AggregationService, private router: Router) { }

  updateUrlParams(queryObj: QueryParams, componentRoute: any[]): Subscription {
    const aggrSubscription: Subscription = this.aggregationService.field.subscribe((data: any) => {
      const params: { [key: string]: any } = {};
      for (const key of Object.keys(data)) {
        if (data[key] && data[key].length !== 0) {
          params[key] = data[key];
        }
      }
      if (queryObj['search']) {
        params['searchTerm'] = queryObj['search'];
      }
      if (queryObj['sort']) {
        params['sortTerm'] = queryObj['sort'][0];
        params['sortDirection'] = queryObj['sort'][1];
      }
      this.router.navigate(componentRoute, { queryParams: params, replaceUrl: true, skipLocationChange: false });
    });
    return aggrSubscription;
  }

  setUpAggregationFilters(params: QueryParams) {
    const filters: { [key: string]: any[] } = {};
    for (const key in params) {
      if (key !== 'searchTerm' && key !== 'sortTerm' && key !== 'sortDirection' && key !== 'pageIndex') {
        if (Array.isArray(params[key])) {
          filters[key] = params[key];
          for (const value of params[key]) {
            this.aggregationService.current_active_filters.push(value);
            (this.aggregationService.active_filters as any)[key].push(value);
          }
        } else {
          filters[key] = [params[key]];
          this.aggregationService.current_active_filters.push(params[key]);
          (this.aggregationService.active_filters as any)[key].push(params[key]);
        }
      }
    }
    this.aggregationService.field.next(this.aggregationService.active_filters);
    this.filtersSubject.next(filters);
    return filters;
  }

  resetFilter() {
    for (const key of Object.keys(this.aggregationService.active_filters)) {
      (this.aggregationService.active_filters as any)[key] = [];
    }
    this.aggregationService.current_active_filters = [];
    this.filtersSubject.next({});
  }

  updateActiveFilters() {
    const filters = this.getCurrentFilters();
    this.filtersSubject.next(filters);
  }

  private getCurrentFilters() {
    const filters: { [key in keyof ActiveFilters]?: string[] } = {};
    for (const key in this.aggregationService.active_filters) {
      if ((this.aggregationService.active_filters as any)[key].length > 0) {
        filters[key as keyof ActiveFilters] = (this.aggregationService.active_filters as any)[key];
      }
    }
    return filters;
  }
}
