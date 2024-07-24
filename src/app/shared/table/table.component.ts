import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCellDef, MatHeaderRowDef, MatRowDef, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { NgForOf, TitleCasePipe, CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { ApiDataService } from "../../services/api-data.service";
import { FilterStateService } from '../../services/filter-state.service';
import { MatFormField } from "@angular/material/form-field";

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
}

export const ELEMENT_DATA: PeriodicElement[] = [
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
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatFormField,
    MatInputModule,
    NgForOf,
    TitleCasePipe
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() filters: any = {};
  @Input() search: string = '';
  @Output() dataUpdate = new EventEmitter<any>();
  @Output() sortUpdate = new EventEmitter<any>();
  displayedColumns: string[] = ['name', 'position', 'weight', 'symbol', 'test1', 'test2', 'test3', 'test4'];
  columnHeaders: { [key: string]: string } = {
    'name': 'Name',
    'position': 'Position',
    'weight': 'Weight',
    'symbol': 'Symbol',
    'test1': 'Test 1',
    'test2': 'Test 2',
    'test3': 'Test 3',
    'test4': 'Test 4'
  };
  dataSource = new MatTableDataSource<PeriodicElement>();
  private filtersSubscription: Subscription | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;
  currentSearchTerm: string = '';
  delaySearch: boolean = true;
  timer: any;

  constructor(private dataService: ApiDataService, private filterStateService: FilterStateService) {}

  ngOnInit(): void {
    this.loadData();
    this.filtersSubscription = this.filterStateService.filtersChanged.subscribe(filters => {
      this.loadData(filters, this.search);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort?.sortChange.subscribe(() => {
      this.sortUpdate.emit([this.sort?.active, this.sort?.direction]);
    });
  }

  loadData(filters: any = {}, search: string = '') {
    this.dataService.getData(filters, search).subscribe(data => {
      this.dataSource.data = data;
      this.dataUpdate.emit(this.dataSource.data);
    });
  }

  ngOnDestroy() {
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
  }

  searchChanged(event: KeyboardEvent) {
    const searchFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (this.delaySearch) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.applySearchFilter(searchFilterValue), 500);
    } else {
      this.applySearchFilter(searchFilterValue);
    }
  }

  applySearchFilter(value: string) {
    this.currentSearchTerm = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
