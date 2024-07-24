import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatTableModule, MatTableDataSource} from "@angular/material/table";
import {HeaderComponent} from "../shared/header/header.component";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FooterComponent} from "../shared/footer/footer.component";
import {MediaMatcher} from "@angular/cdk/layout";
import {FilterComponent} from "../shared/filter/filter.component";
import {ActiveFilterComponent} from "../shared/active-filter/active-filter.component";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {TableComponent} from "../shared/table/table.component";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterStateService} from "../services/filter-state.service";
import {AggregationService} from "../services/aggregation.service";

@Component({
  selector: 'app-data-portal',
  standalone: true,
  imports: [MatCardModule, MatTableModule, HeaderComponent, MatInputModule, MatFormFieldModule,
    MatSidenavModule, FooterComponent, FilterComponent, ActiveFilterComponent, MatIcon, NgIf, TableComponent],
  templateUrl: './data-portal.component.html',
  styleUrl: './data-portal.component.css'
})
export class DataPortalComponent implements OnInit, OnDestroy {
  @ViewChild(TableComponent, { static: true }) tableServerComponent: TableComponent | undefined;
  filter_field: any;
  subscriber = { email: '', title: '', indexName: '', indexKey: ''};
  aggrSubscription: Subscription | undefined;

  query = {
    sort: ['id_number', 'desc'],
    _source: [
    ],
    filters: {}
  };
  mobileQuery: MediaQueryList;
  opened = true;

  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher,
    private titleService: Title, private router: Router, private filterStateService: FilterStateService,
    private activatedRoute: ActivatedRoute, private aggregationService: AggregationService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Data Portal');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filterStateService.resetFilter();
      this.filter_field = this.filterStateService.setUpAggregationFilters(params);
    });
    if (this.tableServerComponent) {
      this.tableServerComponent.dataUpdate.subscribe((data) => {
        this.aggregationService.getAggregations(data);
      });
    }
    this.aggrSubscription = this.filterStateService.updateUrlParams(this.query, ['data_portal']);
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
    this.router.navigate(['data_portal'], {queryParams: {}, replaceUrl: true, skipLocationChange: false});
  }
}
