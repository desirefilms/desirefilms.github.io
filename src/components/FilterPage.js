// src/components/FilterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFilmsByFilter, getFilters } from '../api';
import Loading from './Loading';

function FilterPage() {
  const navigate = useNavigate();

  // Списки стран/жанров из /films/filters
  const [countriesList, setCountriesList] = useState([]);
  const [genresList, setGenresList] = useState([]);

  // Параметры фильтра
  const [country, setCountry] = useState('');      // id страны
  const [genre, setGenre] = useState('');          // id жанра
  const [order, setOrder] = useState('RATING');    // RATING, NUM_VOTE, YEAR
  const [type, setType] = useState('ALL');         // FILM, TV_SHOW, TV_SERIES, MINI_SERIES, ALL
  const [ratingFrom, setRatingFrom] = useState(0);
  const [ratingTo, setRatingTo] = useState(10);
  const [yearFrom, setYearFrom] = useState(1900);
  const [yearTo, setYearTo] = useState(2025);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  // Результаты запроса
  const [filmsData, setFilmsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загружаем список стран/жанров при монтировании
  useEffect(() => {
    getFilters()
      .then(data => {
        setCountriesList(data.countries || []);
        setGenresList(data.genres || []);
      })
      .catch(err => console.error('Ошибка загрузки фильтров:', err));
  }, []);

  // Функция для загрузки фильмов по фильтру
  const loadFilms = () => {
    setLoading(true);
    getFilmsByFilter({
      countries: country,
      genres: genre,
      order,
      type,
      ratingFrom,
      ratingTo,
      yearFrom,
      yearTo,
      keyword,
      page
    })
      .then(data => {
        setFilmsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки фильмов по фильтру:', err);
        setLoading(false);
      });
  };

  // Когда меняется страница — перезапрашиваем
  useEffect(() => {
    loadFilms();
    // eslint-disable-next-line
  }, [page]);

  // При сабмите формы (нажатие «Применить»)
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadFilms();
  };

  // Клик на фильм
  const handleFilmClick = (film) => {
    const filmId = film.kinopoiskId || film.filmId;
    navigate(`/film/${filmId}`);
  };

  // Пагинация
  const renderPagination = () => {
    if (!filmsData || !filmsData.totalPages || filmsData.totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= filmsData.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={page === i ? 'selected' : ''}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="filter-page container">
      <h2>Фильтр фильмов</h2>
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-row">
          {/* Страна */}
          <label>
            Страна:
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Любая</option>
              {countriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.country}
                </option>
              ))}
            </select>
          </label>

          {/* Жанр */}
          <label>
            Жанр:
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Любой</option>
              {genresList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.genre}
                </option>
              ))}
            </select>
          </label>

          {/* Сортировка */}
          <label>
            Сортировка:
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="RATING">По рейтингу</option>
              <option value="NUM_VOTE">По количеству оценок пользователей</option>
              <option value="YEAR">По году</option>
            </select>
          </label>

          {/* Тип */}
          <label>
            Тип:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="ALL">Все</option>
              <option value="FILM">Фильмы</option>
              <option value="TV_SHOW">Телешоу</option>
              <option value="TV_SERIES">Сериалы</option>
              <option value="MINI_SERIES">Мини-сериалы</option>
            </select>
          </label>
        </div>

        <div className="filter-row">
          <label>
            Рейтинг от:
            <input
              type="text"
              value={ratingFrom}
              onChange={(e) => setRatingFrom(e.target.value)}
              list="rating-list"
            />
          </label>
          <label>
            Рейтинг до:
            <input
              type="text"
              value={ratingTo}
              onChange={(e) => setRatingTo(e.target.value)}
              list="rating-list"
            />
          </label>
          {/* Datalist для рейтинга (0..10) */}
          <datalist id="rating-list">
            {Array.from({ length: 11 }, (_, i) => i).map(val => (
              <option key={val} value={val} />
            ))}
          </datalist>

          <label>
            Год от:
            <input
              type="text"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              list="years-list"
            />
          </label>
          <label>
            Год до:
            <input
              type="text"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              list="years-list"
            />
          </label>
          {/* Datalist для годов (1900..2025) */}
          <datalist id="years-list">
            {Array.from({ length: 126 }, (_, i) => 1900 + i).map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>

        <div className="filter-row">
          <label>
            Ключевое слово:
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Например: Marvel"
            />
          </label>
        </div>

        <button type="submit" className="filter-submit">Применить</button>
      </form>

      {loading ? (
        <Loading size="30px" />
      ) : filmsData && filmsData.items && filmsData.items.length > 0 ? (
        <>
          <div className="film-list">
            {filmsData.items.map((film) => {
              const title = film.nameRu || film.nameOriginal || 'Без названия';
              const year = film.year ? ` (${film.year})` : '';
              return (
                <div
                  key={film.kinopoiskId || film.filmId}
                  className="film-card"
                  onClick={() => handleFilmClick(film)}
                >
                  <img
                    src={film.posterUrlPreview || film.posterUrl || '/assets/placeholder.jpg'}
                    alt={title}
                  />
                  <p>{title + year}</p>
                </div>
              );
            })}
          </div>
          {renderPagination()}
        </>
      ) : (
        <p>Фильмы не найдены</p>
      )}
    </div>
  );
}

export default FilterPage;
