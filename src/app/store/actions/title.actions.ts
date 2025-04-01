import { createAction, props } from '@ngrx/store';

// Acción para establecer un nuevo título
export const setTitle = createAction(
  '[Title] Set Title',
  props<{ title: string }>()
);
