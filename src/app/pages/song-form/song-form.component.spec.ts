import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongFormComponent } from './song-form.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';


describe('SongFormComponent', () => {
  let component: SongFormComponent;
  let fixture: ComponentFixture<SongFormComponent>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
  });

  describe('Cuando estamos en modo de edición', () => {
    beforeEach(() => {
      mockActivatedRoute = {
        paramMap: of({
          get: (key: string) => {
            if (key === 'id') {
              return '1'; // ID ficticio para edición
            }
            return null;
          },
        }),
      };
      const initialState = {
        songs: {
          id: '1',
          title: 'Test Song',
          artist: '1',
          genre: ['Rock'],
          companies: [{ id: 'company1', name: 'Test Company' }],
          year: 2021,
          duration: 34,
          country: 'USA',
          rating: 5,
        },
        companies: [{ id: 'company1', name: 'Test Company' }],
        loading: false,
      };

      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule,SongFormComponent],
        providers: [
          provideMockStore({ initialState }),
          { provide: TranslateService, useValue: mockTranslateService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SongFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería inicializar en modo de edición con un id de canción válido', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.isEditMode).toBeTrue();
      expect(component.songId).toBe('1');
      console.log(component.form);
      expect(component.form.valid).toBeTruthy();
    });

    it('debería devolver invalido ', () => {
      component.form.controls['title'].setValue('');
      component.form.controls['year'].setValue(1321);
      expect(component.form.valid).toBeFalsy();
    });

    it('should return valid form when all fields are filled', () => {
      component.form.controls['title'].setValue('New Song');
      component.form.controls['year'].setValue(1999);
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('Cuando estamos en modo de creación', () => {
    beforeEach(() => {
      mockActivatedRoute = {
        paramMap: of({
          get: (key: string) => {
            if (key === 'id') {
              return null; // No hay id en la ruta
            }
            return null;
          },
        }),
      };
      const initialState = {
        song: {
          id: '1',
          title: 'Test Song',
          artist: '1',
          genre: ['Rock'],
          companies: [{ id: 'company1', name: 'Test Company' }],
          year: 2021,
          duration: 34,
          country: 'USA',
          rating: 5,
        },
        companies: [{ id: 'company1', name: 'Test Company' }],
        loading: false,
      };

      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule,SongFormComponent],
        providers: [
          provideMockStore({ initialState }),
          { provide: TranslateService, useValue: mockTranslateService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SongFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('debería inicializar en modo de creación sin id de canción', () => {
      expect(component.isEditMode).toBeFalse();
      expect(component.songId).toBeNull();
    });

    // Otros tests para creación...
  });
});