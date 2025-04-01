import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from './shared/menu/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LayoutComponent],
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
