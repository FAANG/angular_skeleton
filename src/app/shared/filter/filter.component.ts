import { NgClass, NgForOf, NgIf } from '@angular/common';
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
  imports: [NgClass, MatCard, NgIf, NgForOf],
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

  onButtonClick(key: string, title: string | undefined) {
    const data_key = this.aggregationService.filterMap[title || ''];
    if (data_key) {
      const index =
        this.aggregationService.active_filters[data_key].indexOf(key);
      if (index > -1) {
        this.aggregationService.active_filters[data_key].splice(index, 1);
      } else {
        this.aggregationService.active_filters[data_key].push(key);
      }

      const active_filter_index =
        this.aggregationService.current_active_filters.indexOf(key);
      if (active_filter_index > -1) {
        this.aggregationService.current_active_filters.splice(
          active_filter_index,
          1
        );
      } else {
        this.aggregationService.current_active_filters.push(key);
      }

      this.aggregationService.field.next(
        this.aggregationService.active_filters
      );
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
