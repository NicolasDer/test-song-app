import { TitleState } from '../state/title.state';
import { createReducer, on } from '@ngrx/store';
import { setTitle } from '../actions/title.actions';

export const initialState: TitleState = {
  title: '',
};

export const titleReducer = createReducer(
  initialState,
  on(setTitle, (state, { title }) => ({
    ...state,
    title,
  }))
);
