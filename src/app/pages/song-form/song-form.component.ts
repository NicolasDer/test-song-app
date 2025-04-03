import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from '../../models/song.model';
import { select, Store } from '@ngrx/store';
import {
  selectArtists,
  selectCompanies,
  selectCompaniesForSong,
  selectSongById,
} from '../../store/selectors/songs.selector';
import { CommonModule } from '@angular/common';
import { createSong, saveSong } from '../../store/actions/song.actions';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist.model';
import { Company } from '../../models/company.model';
import { setTitle } from '../../store/actions/title.actions';
import { TranslateService } from '@ngx-translate/core';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { SongForm } from '../../models/song-form.model';

@Component({
  selector: 'app-song-form',
  imports: [ReactiveFormsModule, CommonModule, IconButtonComponent],
  templateUrl: './song-form.component.html',
  styleUrl: './song-form.component.scss',
})
export class SongFormComponent {
  form!: FormGroup;

  isEditMode: boolean = false;
  songId: string | null = null;
  song: Song | null = null;

  artists$: Observable<{ [id: string]: Artist }> =
    this.store.select(selectArtists);
  companies$: Observable<{ [id: string]: Company }> =
    this.store.select(selectCompanies);

  @ViewChild('inputGenre') inputGenre!: ElementRef;
  @ViewChild('companiesSelect') companiesSelect!: ElementRef;
  companiesList: Company[] = [];
  availableCompanies: string[] = [];

  //TODO: cambiar dummys por carga de imagen real
  posters = [
    'http://dummyimage.com/600x400.png/cc0000/ffffff',
    'http://dummyimage.com/600x400.png/dddddd/000000',
    'http://dummyimage.com/600x400.png/5fa2dd/ffffff',
    'http://dummyimage.com/600x400.png/ff4444/ffffff',
  ];
  poster : string ='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.songId],
      title: ['', Validators.required],
      artist: ['', Validators.required],
      genre: this.fb.array([]),
      companies: this.fb.array([]),
      year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(2100)],
      ],
      duration: ['', Validators.required],
      country: [''],
      rating: [
        '',
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.songId = id;
        this.store
          .pipe(select(selectSongById(this.songId)))
          .subscribe((song) => {
            if (song) {
              this.form.patchValue(song);
              song.genre.forEach((g) => this.addGenre(g));
              this.poster = song.poster;
            }
          });

        this.store
          .pipe(select(selectCompaniesForSong(this.songId)))
          .subscribe((companies) =>
            companies.forEach((company) => {
              if (company.id) {
                this.addCompany(company?.id);
              }
            })
          );

        this.store.dispatch(
          setTitle({
            title: this.translate.instant('EDIT.SONG') || 'MISSING TITLE',
          })
        );
      } else {
        this.isEditMode = false;
        this.songId = null;
        this.store.dispatch(
          setTitle({
            title: this.translate.instant('NEW.SONG') || 'MISSING TITLE',
          })
        );
        //TODO: cambiar dummys por carga de imagen real
        this.poster = this.posters[Math.floor(Math.random() * 4)];
      }
    });
    this.companies$.subscribe((companies) => {
      this.companiesList = Object.values(companies);
      this.availableCompanies = this.companiesList
        .map((company) => company.id)
        .filter((id) => id !== undefined) as string[];
    });
    this.cdr.detectChanges();
  }

  get genres() {
    return this.form.get('genre') as FormArray;
  }

  addGenre(genre: string): void {
    if (genre && !this.genres.value.includes(genre)) {
      this.genres.push(new FormControl(genre));
      if (this.inputGenre) {
        this.inputGenre.nativeElement.value = '';
      }
    }
  }

  removeGenre(index: number): void {
    this.genres.removeAt(index);
  }

  get companies() {
    return this.form.get('companies') as FormArray;
  }

  getCompanyNameById(companyId: string): string | undefined {
    const company = this.companiesList.find((c) => c.id === companyId);
    return company ? company.name : undefined;
  }

  addCompanyEvent(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.addCompany(selectElement.value);
  }

  addCompany(companyId: string) {
    if (!this.companies.value.includes(companyId)) {
      this.companies.push(new FormControl(companyId));
      this.availableCompanies = this.availableCompanies.filter(
        (id) => id !== companyId
      );
      if (this.companiesSelect) {
        this.companiesSelect.nativeElement.value = '';
        this.companiesSelect.nativeElement.blur();
      }
    }
  }

  removeCompany(index: number): void {
    this.availableCompanies.push(this.companies.value[index]);
    this.companies.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const song: SongForm = this.form.value;
      song.poster = this.poster;
      if (this.isEditMode) {
        console.log(song)
        this.store.dispatch(saveSong({ song }));
      } else {
        this.store.dispatch(createSong({ song }));
      }
    } else {
      console.log(this.form.get('rating')?.invalid);
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched();
      });
    }
  }
}
