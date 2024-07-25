import { CommonModule, NgForOf, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MockElementsAggregationService } from '../../services/aggregation/mock-elements-aggregation.service';
import DataServiceInterface, {
  ColumnHeadersMapInterface,
  DisplayedColumnsInterface,
} from '../../services/data/data.service.interface';
import { FilterStateService } from '../../services/filter/filter-state.service';

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
    TitleCasePipe,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() dataService!: DataServiceInterface;
  @Input() filters: any = {};
  @Input() search: string = '';

  @Output() dataUpdate = new EventEmitter<any>();
  @Output() sortUpdate = new EventEmitter<any>();

  protected dataSource = new MatTableDataSource<{}>();
  protected displayedColumns: DisplayedColumnsInterface = [];
  protected columnHeaders: ColumnHeadersMapInterface = {};

  private filtersSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;

  currentSearchString: string = '';
  delaySearch: boolean = true;
  timer: NodeJS.Timeout | undefined;

  constructor(
    private router: Router,
    private aggregationService: MockElementsAggregationService,
    private filterStateService: FilterStateService
  ) {}

  ngOnInit(): void {
    this.filterStateService.aggregationService = this.aggregationService;
    if (!this.dataService) {
      throw new Error('dataService is required');
    }

    this.displayedColumns = this.dataService.displayedColumns;
    this.columnHeaders = this.dataService.columnHeadersMap;
    this.loadData();
    this.filtersSubscription = this.filterStateService.filtersChanged.subscribe(
      (filters) => {
        this.loadData(filters, this.search);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort?.sortChange.subscribe(() => {
      this.sortUpdate.emit([this.sort?.active, this.sort?.direction]);
    });
  }

  loadData(filters: any = {}, search: string = '') {
    this.dataService.getData(filters, search).subscribe((data) => {
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
    const searchFilterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (this.delaySearch) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(
        () => this.applySearchFilter(searchFilterValue),
        500
      );
    } else {
      this.applySearchFilter(searchFilterValue);
    }
  }

  applySearchFilter(value: string) {
    this.currentSearchString = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
