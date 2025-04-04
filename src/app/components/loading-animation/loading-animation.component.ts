import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSavingState } from '../../store/selectors/songs.selector';

@Component({
  selector: 'app-loading-animation',
  imports: [CommonModule],
  templateUrl: './loading-animation.component.html',
  styleUrl: './loading-animation.component.scss'
})
export class LoadingAnimationComponent {
  initial:boolean = true;
  saving$ = this.store.select(selectSavingState)

  constructor(
    private store:Store
  ){
    setTimeout(() => {
      this.initial = false;
    }, 2000)
  }
}
