import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria-page/galeria-page').then(m => m.GaleriaPage),
  },
  {
    path: 'agendamento',
    loadComponent: () => import('./pages/agendamento/agendamento').then(m => m.Agendamento),
  },
  {
    path: 'contato',
    loadComponent: () => import('./pages/contato-page/contato-page').then(m => m.ContatoPage),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin-login/admin-login').then(m => m.AdminLogin),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
