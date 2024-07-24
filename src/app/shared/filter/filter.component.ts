import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AggregationService } from '../../services/aggregation.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatCard } from '@angular/material/card';

interface AggregationData {
  name: [string, number][];
  position: [string, number][];
  weight: [string, number][];
  symbol: [string, number][];
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    NgClass,
    MatCard,
    NgIf,
    NgForOf
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() filterSize: number = 1;
  aggregation: [string, number][] = [];
  subscription?: Subscription;
  isCollapsed = true;
  itemLimit: number = 1;

  private readonly filterMap: { [key: string]: keyof AggregationData } = {
    'Name': 'name',
    'Position': 'position',
    'Weight': 'weight',
    'Symbol': 'symbol'
  };

  constructor(
    public aggregationService: AggregationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.itemLimit = this.filterSize;
    this.subscription = this.aggregationService.data.subscribe(
      (data: AggregationData) => {
        const key = this.filterMap[this.title];
        if (key) {
          this.aggregation = data[key];
        }
        this.cdRef.detectChanges();
      }
    );
  }

  onButtonClick(key: string, title: string | undefined) {
    const data_key = this.filterMap[title || ''];
    if (data_key) {
      const index = this.aggregationService.active_filters[data_key].indexOf(key);
      if (index > -1) {
        this.aggregationService.active_filters[data_key].splice(index, 1);
      } else {
        this.aggregationService.active_filters[data_key].push(key);
      }

      const active_filter_index = this.aggregationService.current_active_filters.indexOf(key);
      if (active_filter_index > -1) {
        this.aggregationService.current_active_filters.splice(active_filter_index, 1);
      } else {
        this.aggregationService.current_active_filters.push(key);
      }

      this.aggregationService.field.next(this.aggregationService.active_filters);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.itemLimit = this.isCollapsed ? this.filterSize : 10000;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
