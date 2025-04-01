import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { setTitle } from '../../store/actions/title.actions';

@Component({
  selector: 'app-artists',
    imports: [TranslateModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.scss'
})
export class ArtistsComponent {
  title$: Observable<string> = new Observable<string>();

  constructor(
    private store: Store,
    private translate: TranslateService
  ) {
    this.updatePageTitle();
  }

  private updatePageTitle() {
    this.translate.get('SINGERS').subscribe((translatedTitle: string) => {
      this.store.dispatch(setTitle({ title: translatedTitle }));
    });
  }
}
