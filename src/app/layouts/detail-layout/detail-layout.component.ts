import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { selectTitle } from '../../store/selectors/title.selector';

@Component({
  selector: 'app-detail-layout',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './detail-layout.component.html',
  styleUrls: ['./detail-layout.component.scss']
})
export class DetailLayoutComponent {
  title$: Observable<string> | undefined;

  constructor(private location: Location, private store: Store,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(){
    this.title$ = this.store.pipe(select(selectTitle));
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }
}
