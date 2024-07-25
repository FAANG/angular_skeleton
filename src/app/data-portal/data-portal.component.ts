import { MediaMatcher } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MockElementsAggregationService } from '../services/aggregation/mock-elements-aggregation.service';
import { MockElementsApiDataService } from '../services/data/mock-elements-api-data.service';
import { FilterStateService } from '../services/filter/filter-state.service';
import { ActiveFilterComponent } from '../shared/active-filter/active-filter.component';
import { FilterComponent } from '../shared/filter/filter.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { TableComponent } from '../shared/table/table.component';

@Component({
  selector: 'app-data-portal',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    HeaderComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    FooterComponent,
    FilterComponent,
    ActiveFilterComponent,
    MatIcon,
    NgIf,
    TableComponent,
  ],
  templateUrl: './data-portal.component.html',
  styleUrls: ['./data-portal.component.css'],
  providers: [MockElementsApiDataService, FilterStateService],
})
export class DataPortalComponent implements OnInit, OnDestroy {
  @ViewChild(TableComponent, { static: true }) tableServerComponent:
    | TableComponent
    | undefined;

  filter_field: any;

  aggrSubscription: Subscription | undefined;

  query = {
    sort: ['id_number', 'desc'],
    _source: [],
    filters: {},
  };
  mobileQuery: MediaQueryList;
  opened = true;

  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    protected aggregationService: MockElementsAggregationService,
    public dataService: MockElementsApiDataService,
    private filterStateService: FilterStateService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.filterStateService.aggregationService = this.aggregationService;

    this.titleService.setTitle('Data Portal');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filterStateService.resetFilter();
      this.filter_field =
        this.filterStateService.setUpAggregationFilters(params);
    });
    if (this.tableServerComponent) {
      this.tableServerComponent.dataUpdate.subscribe((data) => {
        this.aggregationService.getAggregations(data);
      });
    }
    this.aggrSubscription = this.filterStateService.updateUrlParams(
      this.query,
      ['data_portal']
    );
  }

  toggle() {
    this.opened = !this.opened;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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
    this.router.navigate(['data_portal'], {
      queryParams: {},
      replaceUrl: true,
      skipLocationChange: false,
    });
  }
}
