import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import { Sample, samples } from '../model/dashboard.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['column1', 'column2', 'column3', 'column4', 'column5'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
  }

  applyFilter(event: Event, columnName: keyof Sample) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Sample, filter: string) => {
      return data[columnName].toLowerCase().includes(filter.trim().toLowerCase());
    };
  }

}
