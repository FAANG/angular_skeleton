import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TableServerSideComponent }  from '../../shared/table-server-side/table-server-side.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(TableServerSideComponent, { static: true }) tableServerComponent: TableServerSideComponent | undefined;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
  }

}
