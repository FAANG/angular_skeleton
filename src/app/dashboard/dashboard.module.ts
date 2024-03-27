import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './component/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCard } from "@angular/material/card";
import { MatFormField } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';


@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatCard,
        MatFormField,
        MatInputModule
    ]
})
export class DashboardModule { }
