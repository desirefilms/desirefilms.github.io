import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFilms } from '../api';
import Loading from './Loading';

function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [lastWatched, setLastWatched] = useState(null);

  // При загрузке проверяем localStorage
  useEffect(() => {
    const savedFilm = localStorage.getItem('lastWatchedFilm');
    if (savedFilm) {
      setLastWatched(JSON.parse(savedFilm));
    }
  }, []);

  // Debounce автодополнения
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== '') {
        searchFilms(query)
          .then(data => {
            setSuggestions(data.slice(0, 10));
          })
          .catch(err => console.error(err));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = () => {
    setLoading(true);
    searchFilms(query)
      .then(data => {
        setFilms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // При клике на фильм — сохраняем его как последний просмотр
  const handleFilmClick = (film) => {
    const filmData = {
      kinopoiskId: film.kinopoiskId || film.filmId,
      title: film.nameRu || film.nameOriginal || 'Без названия',
      year: film.year || '',
      poster: film.posterUrlPreview || film.posterUrl || '/assets/placeholder.jpg'
    };
    localStorage.setItem('lastWatchedFilm', JSON.stringify(filmData));
    navigate(`/film/${filmData.kinopoiskId}`);
  };

  const continueWatching = () => {
    if (lastWatched && lastWatched.kinopoiskId) {
      navigate(`/film/${lastWatched.kinopoiskId}`);
    }
  };

  return (
    <div className="search-page container">
      <h2>Ищите, что вашей душе угодно</h2>

      {/* Строка поиска */}
      <div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Найти..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map(film => {
                const title = film.nameRu || film.nameOriginal || 'Без названия';
                const year = film.year ? ` (${film.year})` : '';
                return (
                  <li
                    key={film.kinopoiskId || film.filmId}
                    onClick={() => handleFilmClick(film)}
                  >
                    {title + year}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button onClick={handleSearch}>Поиск</button>
      </div>

      {loading && <Loading size="30px" />}

      {/* Блок «Последний просмотр» теперь ниже строки поиска */}
      {lastWatched && (
        <div
          style={{
            marginTop: '20px',
            backgroundColor: '#54497e',
            padding: '10px',
            borderRadius: '10px'
          }}
        >
          <h3 style={{ marginTop: 0 }}>Последний просмотр</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <img
              src={lastWatched.poster}
              alt={lastWatched.title}
              style={{ width: '50px', borderRadius: '5px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                {lastWatched.title} {lastWatched.year ? `(${lastWatched.year})` : ''}
              </p>
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#6c5a94',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={continueWatching}
              >
                Продолжить просмотр →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Список фильмов (результаты поиска) */}
      <div className="film-list">
        {films && films.map(film => {
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
    </div>
  );
}

export default SearchPage;
