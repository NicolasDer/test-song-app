import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SongListComponent } from './pages/song-list/song-list.component';
import { SongFormComponent } from './pages/song-form/song-form.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'songs',
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'songs',
        component: SongListComponent,
      },
      {
        path: 'artists',
        loadComponent: () =>
          import('./pages/artists/artists.component').then(
            (m) => m.ArtistsComponent
          ),
      },
      {
        path: 'companies',
        loadComponent: () =>
          import('./pages/companies/companies.component').then(
            (m) => m.CompaniesComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/detail-layout/detail-layout.component').then(
        (m) => m.DetailLayoutComponent
      ),
    children: [
      {
        path: 'songs/create',
        loadComponent: () =>
          import('./pages/song-form/song-form.component').then(
            (m) => m.SongFormComponent
          ),
      },
      {
        path: 'songs/edit/:id',
        loadComponent: () =>
          import('./pages/song-form/song-form.component').then(
            (m) => m.SongFormComponent
          ),
      },
      {
        path: 'songs/:id',
        loadComponent: () =>
          import('./pages/song-detail/song-detail.component').then(
            (m) => m.SongDetailComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'songs',
  },
];
