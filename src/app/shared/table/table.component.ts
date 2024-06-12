import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {catchError} from "rxjs/operators";
import {of as observableOf} from "rxjs";
import {NgForOf, TitleCasePipe} from "@angular/common";

import {Sample, samples} from "../../samples";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApiDataService} from "../../services/api-data.service";


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatCellDef,
    MatHeaderRowDef,
    MatPaginator,
    MatRowDef,
    MatTable,
    NgForOf,
    TitleCasePipe,
    MatColumnDef,
    MatHeaderCellDef,
    MatSort,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['column1', 'column2', 'column3', 'column4', 'column5'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @Output() dataUpdate = new EventEmitter<any>();
  @Input() indexDetails: any;
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
      private dataService: ApiDataService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    return this.dataService.getData(this.dataSource).pipe(
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
    );
  }

  applyFilter(event: Event, columnName: keyof Sample) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Sample, filter: string) => {
      return data[columnName].toLowerCase().includes(filter.trim().toLowerCase());
    };
  }
}
