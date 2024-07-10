import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatCellDef, MatHeaderRowDef, MatRowDef, MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NgForOf, TitleCasePipe, CommonModule } from "@angular/common";
import { Sample } from "../../samples";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { ApiDataService } from "../../services/api-data.service";

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
    NgForOf,
    TitleCasePipe
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
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
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private dataService: ApiDataService) {}

  ngOnInit(): void {
    this.loadData();
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

  applyFilters(filters: any, search: string) {
    this.loadData(filters, search);
  }
}
