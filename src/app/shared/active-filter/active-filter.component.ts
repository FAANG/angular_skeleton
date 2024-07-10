import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../services/aggregation.service';
import { NgForOf } from "@angular/common";

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
    const index = this.aggregationService.current_active_filters.indexOf(field);
    if (index > -1) {
      this.aggregationService.current_active_filters.splice(index, 1);
    }
    (Object.keys(this.data) as (keyof AggregationData)[]).forEach(key => {
      const my_index = this.data[key].findIndex(item => item[0] === field);
      if (my_index > -1) {
        this.data[key].splice(my_index, 1);
      }
    });
    this.aggregationService.field.next(this.aggregationService.active_filters);
  }
}
