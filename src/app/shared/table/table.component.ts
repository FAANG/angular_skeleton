import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCellDef, MatHeaderRowDef, MatRowDef, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { NgForOf, TitleCasePipe, CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Sample } from "../../samples";
import { ApiDataService } from "../../services/api-data.service";
import { FilterStateService } from '../../services/filter-state.service';
import { MatFormField } from "@angular/material/form-field";

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
export class TableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() filters: any = {};
  @Input() search: string = '';
  @Output() dataUpdate = new EventEmitter<any>();
  @Output() sortUpdate = new EventEmitter<any>();
  displayedColumns: string[] = ['biosample_id', 'sex', 'organism', 'breed', 'standard'];
  columnHeaders: { [key: string]: string } = {
    'biosample_id': 'BioSample ID',
    'sex': 'Sex',
    'organism': 'Organism',
    'breed': 'Breed',
    'standard': 'Standard'
  };
  dataSource = new MatTableDataSource<Sample>();
  private filtersSubscription: Subscription | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;
  currentSearchTerm: string = '';
  delaySearch: boolean = true;
  timer: any;
  @Input() query: Object | undefined; // query params ('sort', 'aggs', 'filters', '_source', 'from_')

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] || changes['search']) {
      this.loadData(this.filters, this.search);
    }
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
