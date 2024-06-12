import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

import {TableComponent} from "../shared/table/table.component";
import {GridTableComponent} from "../shared/grid-table/grid-table.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    TableComponent,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardContent,
    GridTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild(TableComponent, { static: true }) tableServerComponent: TableComponent | undefined;

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
  }
}
