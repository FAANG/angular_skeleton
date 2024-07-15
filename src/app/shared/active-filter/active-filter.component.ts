import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";
import { AggregationService } from '../../services/aggregation.service';
import { FilterStateService } from "../../services/filter-state.service";

interface AggregationData {
  sex: [string, number][];
  organism: [string, number][];
  breed: [string, number][];
  standard: [string, number][];
}

@Component({
  selector: 'app-active-filter',
  standalone: true,
  templateUrl: './active-filter.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./active-filter.component.css']
})
export class ActiveFilterComponent implements OnInit {
  aggs: string[] = [];
  data: AggregationData = { sex: [], organism: [], breed: [], standard: [] };

  constructor(private aggregationService: AggregationService) { }

  ngOnInit() {
    this.aggs = this.aggregationService.current_active_filters;
    this.data = this.aggregationService.data.getValue();
    this.aggregationService.field.subscribe((data: any) => {
      this.aggs = this.aggregationService.current_active_filters;
      this.data = this.aggregationService.data.getValue();
    });
  }

  clearFilter(field: string) {
    const currentActiveIndex = this.aggregationService.current_active_filters.indexOf(field);
    if (currentActiveIndex > -1) {
      this.aggregationService.current_active_filters.splice(currentActiveIndex, 1);
    }

    (Object.keys(this.aggregationService.active_filters) as (keyof AggregationData)[]).forEach(key => {
      const filterIndex = this.aggregationService.active_filters[key].indexOf(field);
      if (filterIndex > -1) {
        this.aggregationService.active_filters[key].splice(filterIndex, 1);
      }
    });

    this.aggregationService.field.next(this.aggregationService.active_filters);
  }
}
