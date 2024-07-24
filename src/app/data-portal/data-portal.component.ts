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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  test1: string,
  test2: string,
  test3: string,
  test4: string,
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', },
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
];

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
      'biosampleId',
      'sex',
      'organism',
      'breed',
      'standardMet'
    ],
    search: '',
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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'test1', 'test2', 'test3', 'test4'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  ngOnInit(): void {
    this.titleService.setTitle('Data Portal');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.filterStateService.resetFilter();
      this.loadInitialPageState(params);
    });
    if (this.tableServerComponent) {
      this.tableServerComponent.dataUpdate.subscribe((data) => {
        this.aggregationService.getAggregations(data);
      });
      this.tableServerComponent.sortUpdate.subscribe((sortParams) => {
        this.query.sort = sortParams;
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

  openSubscriptionDialog() {
    this.subscriber.title = 'Subscribing to dashboard'
  }

  loadInitialPageState(params: any) {
    const filters = this.filterStateService.setUpAggregationFilters(params);

    this.filter_field = filters;
    this.query.filters = filters;
    if (params['sortTerm'] && params['sortDirection']) {
      this.query.sort = [params['sortTerm'], params['sortDirection']];
    }
  }
}
