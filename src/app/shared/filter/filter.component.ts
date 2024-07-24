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

    constructor(
        public aggregationService: AggregationService,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.itemLimit = this.filterSize;
        this.subscription = this.aggregationService.data.subscribe(
            (data: AggregationData) => {
                if (this.title === 'Name') {
                    this.aggregation = data.name;
                } else if (this.title === 'Position') {
                    this.aggregation = data.position;
                } else if (this.title === 'Weight') {
                    this.aggregation = data.weight;
                } else if (this.title === 'Symbol') {
                    this.aggregation = data.symbol;
                }
                this.cdRef.detectChanges();
            }
        );
    }

    onButtonClick(key: string, title: string | undefined) {
        let data_key: keyof AggregationData | null = null;
        switch (title) {
            case 'Name': {
                data_key = 'name';
                break;
            }
            case 'Position': {
                data_key = 'position';
                break;
            }
            case 'Weight': {
                data_key = 'weight';
                break;
            }
            case 'Symbol': {
                data_key = 'symbol';
                break;
            }
        }

        if (data_key !== null) {
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
        if (this.isCollapsed) {
            this.itemLimit = 10000;
            this.isCollapsed = false;
        } else {
            this.itemLimit = this.filterSize;
            this.isCollapsed = true;
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
