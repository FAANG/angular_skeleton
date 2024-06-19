import { Routes } from '@angular/router';
import {DataPortalComponent} from "./data-portal/data-portal.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {path: 'data_portal', title: 'Data Portal', component: DataPortalComponent},
];
