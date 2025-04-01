import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { setTitle } from '../../store/actions/title.actions';

@Component({
  selector: 'app-companies',
  imports: [TranslateModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent {
  title$: Observable<string> = new Observable<string>();

  constructor(private store: Store, private translate: TranslateService) {
    this.updatePageTitle();
  }

  private updatePageTitle() {
    this.translate
      .get('RECORD.COMPANIES')
      .subscribe((translatedTitle: string) => {
        this.store.dispatch(setTitle({ title: translatedTitle }));
      });
  }
}
