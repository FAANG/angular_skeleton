import { Component, Input, Output, AfterViewInit, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiDataService } from '../../services/api-data.service';
import { Sample, samples } from "../../dashboard/model/dashboard.model";


@Component({
    selector: 'app-table-server-side',
    templateUrl: './table-server-side.component.html',
    styleUrls: ['./table-server-side.component.css']
})
export class TableServerSideComponent implements OnInit, AfterViewInit {
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
