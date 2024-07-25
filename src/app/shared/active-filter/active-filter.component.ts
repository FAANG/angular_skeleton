import { NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import AggregationServiceInterface, {
  AggregationDataInterface,
} from '../../services/aggregation/aggregation-service.interface';

interface AggregationData {
  name: [string, number][];
  position: [string, number][];
  weight: [string, number][];
  symbol: [string, number][];
}

@Component({
  selector: 'app-active-filter',
  standalone: true,
  templateUrl: './active-filter.component.html',
  imports: [NgForOf],
  styleUrls: ['./active-filter.component.css'],
})
export class ActiveFilterComponent implements OnInit {
  @Input() aggregationService!: AggregationServiceInterface;

  aggs: string[] = [];
  data: AggregationDataInterface = {};

  constructor() {}

  ngOnInit() {
    this.updateFilters();
    this.aggregationService.field.subscribe(() => this.updateFilters());
  }

  updateFilters() {
    this.aggs = this.aggregationService.current_active_filters;
    this.data = this.aggregationService.data.getValue();
  }

  clearFilter(field: string) {
    const activeFilters = this.aggregationService.active_filters;
    const currentFilters = this.aggregationService.current_active_filters;

    const removeFilter = (filters: string[], value: string) => {
      const index = filters.indexOf(value);
      if (index > -1) {
        filters.splice(index, 1);
      }
    };

    removeFilter(currentFilters, field);

    (Object.keys(activeFilters) as (keyof AggregationData)[]).forEach((key) => {
      removeFilter(activeFilters[key], field);
    });

    this.aggregationService.field.next(activeFilters);
  }
}
