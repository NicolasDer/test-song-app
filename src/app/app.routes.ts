import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SongListComponent } from './pages/song-list/song-list.component';

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
        loadComponent: () => import('./pages/artists/artists.component')
          .then(m => m.ArtistsComponent),
      },
      {
        path: 'companies',
        loadComponent: () => import('./pages/companies/companies.component')
          .then(m => m.CompaniesComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'songs',
  }
];
