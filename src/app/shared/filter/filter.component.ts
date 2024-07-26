import { NgClass, NgForOf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Subscription } from 'rxjs';
import AggregationServiceInterface, {
  AggregationDataInterface,
} from '../../services/aggregation/aggregation-service.interface';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgClass, MatCard, NgForOf],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() aggregationService!: AggregationServiceInterface;
  @Input() title: string = '';
  @Input() filterSize: number = 1;

  aggregation: [string, number][] = [];
  subscription?: Subscription;
  isCollapsed = true;
  itemLimit: number = 1;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.itemLimit = this.filterSize;
    this.subscription = this.aggregationService?.data.subscribe(
      (data: AggregationDataInterface) => {
        const key = this.aggregationService.filterMap[this.title];
        if (key) {
          this.aggregation = data[key];
        }
        this.cdRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.itemLimit = this.isCollapsed ? this.filterSize : 10000;
  }

  onButtonClick(key: string, title: string | undefined) {
    const data_key = this.aggregationService.filterMap[title || ''];
    if (data_key) {
      const isActiveInFilters = this.toggleFilter(this.aggregationService.active_filters[data_key], key);
      const isActiveInCurrent = this.toggleFilter(this.aggregationService.current_active_filters, key);

      if (!isActiveInFilters && !isActiveInCurrent) {
        this.aggregationService.current_active_filters.push(key);
      }

      this.aggregationService.field.next(this.aggregationService.active_filters);
    }
  }

  private toggleFilter(filters: string[], value: string): boolean {
    const index = filters.indexOf(value);
    if (index > -1) {
      filters.splice(index, 1);
      return true;
    } else {
      filters.push(value);
      return false;
    }
  }
}
