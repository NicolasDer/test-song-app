import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/songs', pathMatch: 'full' },
    { path: 'songs', loadComponent: () => import('./pages/song-list/song-list.component').then(m => m.SongListComponent) },
    { path: 'artists', loadComponent: () => import('./pages/artists/artists.component').then(m => m.ArtistsComponent) },
    { path: 'companies', loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent) },
    { path: '**', redirectTo: '/songs' }
  ];
