import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { Artist, PopulateStore, Song } from 'shared/data-access';
import { HeaderStore } from 'shared/ui';
import { SongsListComponent } from './songs-list.component';
import { SongsStore } from './songs-list.signal-store';

describe('SongsListComponent', () => {
  let component: SongsListComponent;
  let fixture: ComponentFixture<SongsListComponent>;
  let mockSongsStore: any;
  let mockPopulateStore: any;
  let mockHeaderStore: any;
  let mockTranslateService: any;
  let langChangeSubject: Subject<any>;

  beforeEach(async () => {
    mockSongsStore = {
      songs: jasmine.createSpy('songs').and.returnValue([]),
      getSongs: jasmine.createSpy('getSongs'),
    };

    mockPopulateStore = {
      artists: jasmine.createSpy('artists').and.returnValue([]),
    };

    mockHeaderStore = {
      setHeader: jasmine.createSpy('setHeader'),
    };

    langChangeSubject = new Subject<any>();
    mockTranslateService = {
      get: jasmine.createSpy('get').and.returnValue(of('Songs')),
      onLangChange: langChangeSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: SongsStore, useValue: mockSongsStore },
        { provide: PopulateStore, useValue: mockPopulateStore },
        { provide: HeaderStore, useValue: mockHeaderStore },
        { provide: TranslateService, useValue: mockTranslateService },
        provideRouter([]),
      ],
    })
      .overrideComponent(SongsListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SongsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSongs on songStore during ngOnInit', async () => {
    mockSongsStore.getSongs.calls.reset();
    await component.ngOnInit();
    expect(mockSongsStore.getSongs).toHaveBeenCalled();
  });

  it('should set header on ngOnInit using the translate service', async () => {
    mockHeaderStore.setHeader.calls.reset();
    await component.ngOnInit();
    expect(mockHeaderStore.setHeader).toHaveBeenCalledWith({
      title: 'Songs',
      goBack: false,
    });
  });

  it('should update header when language changes', async () => {
    // Simulate a language change event with new translation
    langChangeSubject.next({
      translations: { general: { Songs: 'Canciones' } },
    });
    fixture.detectChanges();
    expect(mockHeaderStore.setHeader).toHaveBeenCalledWith({
      title: 'Canciones',
      goBack: false,
    });
  });

  it('should set tooltip text on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.tooltip()).toBe('Añadir canción');
  });

  describe('populatedSongs computed property', () => {
    const songData: Song[] = [
      {
        id: '1',
        title: 'Song Title',
        poster: 'poster-url.jpg',
        genre: ['Rock'],
        year: 2022,
        duration: 210,
        rating: 4.5,
        artist: 2,
      },
    ];

    const artistData: Artist[] = [
      {
        id: 2,
        name: 'Artist Name',
        bornCity: 'Test City',
        birthdate: '2000-01-01',
        img: 'artist-img.jpg',
        rating: 5,
        songs: [],
      },
    ];

    beforeEach(() => {
      mockSongsStore.songs.and.returnValue(songData);
      mockPopulateStore.artists.and.returnValue(artistData);

      fixture = TestBed.createComponent(SongsListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should populate songs with artist data when songs and artists are available', () => {
      const result = component.populatedSongs();
      expect(result).toEqual([
        {
          id: '1',
          title: 'Song Title',
          poster: 'poster-url.jpg',
          genre: ['Rock'],
          year: 2022,
          duration: 210,
          rating: 4.5,
          artist: 2,
          _artist: artistData[0],
        },
      ]);
    });
  });
});
