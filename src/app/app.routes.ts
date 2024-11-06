import { Routes } from '@angular/router';
import {DataPortalComponent} from "./data-portal/data-portal.component";
import {HomeComponent} from "./home/home.component";
import {NameDetailComponent} from "./data-portal/name-detail/name-detail.component";

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  {path: 'data_portal', title: 'Data Portal', component: DataPortalComponent},
  {path: 'data_portal/:id', title: 'Name Detail', component: NameDetailComponent}
];
