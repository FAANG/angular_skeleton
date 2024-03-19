import { OnInit, Component, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Sample, samples } from '../model/dashboard.model';
import { MatSort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  displayedColumns = ['column1', 'column2', 'column3', 'column4', 'column5'];
  dataSource = new MatTableDataSource<Sample>(samples);
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort, {}) sort: MatSort | undefined;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
  }
}
