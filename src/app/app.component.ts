import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');   
  }

  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.translate.use(selectElement.value);
  }
}
