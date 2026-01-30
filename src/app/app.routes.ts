import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'lecture',
    loadComponent: () => import('./pages/lecture/lecture.component').then(m => m.LectureComponent),
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Task.Reader', 'Task.Writer'] }
  },
  {
    path: 'ecriture',
    loadComponent: () => import('./pages/ecriture/ecriture.component').then(m => m.EcritureComponent),
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Task.Writer'] }
  },
  {
    path: 'acces-refuse',
    loadComponent: () => import('./pages/acces-refuse/acces-refuse.component').then(m => m.AccesRefuseComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ''
  }
];
