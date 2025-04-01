import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTitle } from '../../store/selectors/title.selector';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isOpen = signal(false);
  title$: Observable<string> = new Observable<string>();

  menuItems = [
    { path: '/songs', label: 'SONGS', icon: 'fa-music' },
    { path: '/artists', label: 'SINGERS', icon: 'fa-user' },
    {
      path: '/companies',
      label: 'RECORD.COMPANIES',
      icon: 'fa-building'
    },
  ];

  constructor(private router: Router, private store:Store) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(this.isMobile()){
          this.isOpen.set(false);
        }
      }
    });
  }

  ngOnInit(){
    this.title$ = this.store.select(selectTitle);
  }

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  isMobile(): boolean {
    return window.innerWidth < 1024;
  }
}
