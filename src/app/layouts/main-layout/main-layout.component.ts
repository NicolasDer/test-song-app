import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isOpen = signal(false);
  pageTitle = signal('');

  menuItems = [
    { path: '/songs', label: 'SONGS', title: 'SONGS', icon: 'fa-music' },
    { path: '/artists', label: 'SINGERS', title: 'SINGERS', icon: 'fa-user' },
    {
      path: '/companies',
      label: 'RECORD.COMPANIES',
      title: 'RECORD.COMPANIES',
      icon: 'fa-building'
    },
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(this.isMobile()){
          this.isOpen.set(false);
        }
        this.updateTitle(event.url);
      }
    });
  }

  toggleMenu() {
    this.isOpen.set(!this.isOpen());
  }

  private updateTitle(url: string) {
    const menuItem = this.menuItems.find((item) => item.path == url);
    this.pageTitle.set(menuItem?.title || 'TITLE.MISSING');
  }

  isMobile(): boolean {
    return window.innerWidth < 1024;
  }
}
