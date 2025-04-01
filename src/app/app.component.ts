import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { loadArtists, loadCompanies, loadSongs } from './store/actions/song.actions';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService,private store: Store) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit(){
    this.store.dispatch(loadSongs());
    this.store.dispatch(loadArtists());
    this.store.dispatch(loadCompanies());
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.translate.use(selectElement.value);
  }
}
