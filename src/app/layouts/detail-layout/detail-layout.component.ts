import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { selectTitle } from '../../store/selectors/title.selector';

@Component({
  selector: 'app-detail-layout',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './detail-layout.component.html',
  styleUrls: ['./detail-layout.component.scss'],
})
export class DetailLayoutComponent {
  title$: Observable<string> = new Observable<string>();

  constructor(private location: Location, private store: Store) {}

  ngOnInit() {
    this.title$ = this.store.select(selectTitle);
  }

  goBack() {
    this.location.back();
  }
}
