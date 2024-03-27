import { Component, Input, Output, AfterViewInit, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup } from '@angular/forms';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
    apiKey: string | undefined;
    totalHits = 0;
    subscriptionForm: FormGroup | undefined;
    loading = false;
    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private dataService: ApiDataService
    ) {}

    ngOnInit(): void {

    }

    ngAfterViewInit() {
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
