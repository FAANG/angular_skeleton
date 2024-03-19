import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        children: [
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }
        ]
    },
    {
        path: '',
        children: [
            { path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
            { path: '**', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }
        ]
    }
];
