import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './component/dashboard.component';
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatCard } from "@angular/material/card";
import { TableServerSideComponent } from "../shared/table-server-side/table-server-side.component";
import {
    MatCell, MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef,
    MatTable
} from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatSort } from "@angular/material/sort";


@NgModule({
    declarations: [
        DashboardComponent,
        TableServerSideComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatFormField,
        MatCard,
        MatTable,
        MatColumnDef,
        MatPaginator,
        MatFormFieldModule,
        MatInputModule,
        MatHeaderRow,
        MatRow,
        MatHeaderCell,
        MatCell,
        MatSort,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRowDef,
        MatRowDef
    ]
})
export class DashboardModule { }
