import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes} from "@angular/router";
import {DataPortalComponent} from "./data-portal/data-portal.component";


export const routes: Routes = [
  { path: '', redirectTo: 'data_portal', pathMatch: 'full' },
  { path: 'data_portal', title: 'Data Portal', component: DataPortalComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
