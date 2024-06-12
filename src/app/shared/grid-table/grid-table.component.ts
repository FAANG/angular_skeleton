import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {Sample, samples} from "../../samples";
import {ApiDataService} from "../../services/api-data.service";
import {catchError} from "rxjs/operators";
import {of as observableOf} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-grid-table',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    NgForOf,
    TitleCasePipe,
    MatColumnDef,
    MatHeaderCellDef
  ],
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.css'
})
export class GridTableComponent implements OnInit, AfterViewInit {
  displayedColumns: (keyof Sample)[] = ['column1', 'column2', 'column3', 'column4'];
  dataSource = new MatTableDataSource<Sample>(samples.slice(0, 4));
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

}
