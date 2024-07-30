import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatTableModule, MatTableDataSource} from "@angular/material/table";
import {HeaderComponent} from "../shared/header/header.component";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FooterComponent} from "../shared/footer/footer.component";
import {MediaMatcher} from "@angular/cdk/layout";
import {NgClass} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from "@angular/material/button";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 11, name: 'Neon', weight: 20.1797, symbol: 'Ne', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'},
  {position: 12, name: 'Neon', weight: 20.1797, symbol: 'Ne', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4'}
];

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
    NgClass,
    MatPaginator,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './data-portal.component.html',
  styleUrls: ['./data-portal.component.css']
})
export class DataPortalComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  opened = true;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  displayedColumns: (keyof PeriodicElement)[] = ['position', 'name', 'weight', 'symbol', 'test1', 'test2', 'test3', 'test4'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  countedFilterFields: Record<string, { id: string, value: number }[]> = {};
  selectedFilters: Record<string, string | number> = {};
  searchTerm: string = '';

  ngOnInit(): void {
    this.countFilterFields();
    this.setupFilterPredicate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  toggle() {
    this.opened = !this.opened;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  countFilterFields() {
    const filteredData = this.dataSource.filteredData;

    this.displayedColumns.forEach(column => {
      const columnValues: { id: string, value: number }[] = [];

      const uniqueValues: Record<string, number> = {};
      filteredData.forEach(element => {
        const value = element[column] as string | number;
        const valueStr = value.toString();
        if (uniqueValues[valueStr]) {
          uniqueValues[valueStr]++;
        } else {
          uniqueValues[valueStr] = 1;
        }
      });

      for (const key in uniqueValues) {
        columnValues.push({ id: key, value: uniqueValues[key] });
      }

      this.countedFilterFields[column] = columnValues;
    });
  }

  applyFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyColumnFilter();
  }

  onFilterSelect(column: string, value: string | number) {
    this.selectedFilters[column] = value;
    this.applyColumnFilter();
  }

  setupFilterPredicate() {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const parsedFilter = JSON.parse(filter);
      const searchTerm = parsedFilter.search.toLowerCase();
      const filters = parsedFilter.filters;

      const matchesFilters = Object.keys(filters).every(key => {
        return data[key as keyof PeriodicElement] == filters[key];
      });

      const matchesSearch = this.displayedColumns.some(column => {
        return data[column].toString().toLowerCase().includes(searchTerm);
      });

      return matchesFilters && matchesSearch;
    };
  }

  applyColumnFilter() {
    const combinedFilter = JSON.stringify({ search: this.searchTerm, filters: this.selectedFilters });
    this.dataSource.filter = combinedFilter;
    this.countFilterFields()
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilters = {};
    this.applyColumnFilter();
  }

  getSelectedFilterList() {
    return Object.entries(this.selectedFilters).map(([key, value]) => ({ key, value }));
  }

  isFilterActive(column: string, value: string | number): boolean {
    return this.selectedFilters[column] === value;
  }

  clearFilter(key: string) {
    delete this.selectedFilters[key];
    this.applyColumnFilter();
  }
}
