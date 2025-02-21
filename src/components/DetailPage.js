import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilmDetails, fetchStreamingSources } from '../api';
import Loading from './Loading';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);
  const [sources, setSources] = useState([]);
  const [selectedPlayerUrl, setSelectedPlayerUrl] = useState('');
  const [loadingFilm, setLoadingFilm] = useState(true);
  const [loadingSources, setLoadingSources] = useState(true);

  useEffect(() => {
    setLoadingFilm(true);
    getFilmDetails(id)
      .then(data => {
        setFilm(data);
        setLoadingFilm(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingFilm(false);
      });
  }, [id]);

  useEffect(() => {
    setLoadingSources(true);
    fetchStreamingSources(id)
      .then(data => {
        setSources(data);
        if (data.length > 0) {
          setSelectedPlayerUrl(data[0].iframeUrl);
        }
        setLoadingSources(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingSources(false);
      });
  }, [id]);

  const getRatingColor = (rating) => {
    if (!rating) return '#fff';
    const numeric = parseFloat(rating);
    return numeric < 6 ? 'red' : 'green';
  };

  if (loadingFilm) {
    return (
      <div className="detail-page container">
        <Loading size="30px" />
        <p>Загрузка деталей фильма...</p>
      </div>
    );
  }

  if (!film) {
    return <p className="detail-page container">Фильм не найден</p>;
  }

  return (
    <div className="detail-page container">
      <button onClick={() => navigate('/')}>← Назад к поиску</button>

      {/* Информация о фильме */}
      <div className="film-detail">
        <div className="poster">
          <img
            src={film.posterUrl || '/assets/placeholder.jpg'}
            alt={film.nameRu || film.nameOriginal}
          />
        </div>
        <div className="details">
          <h2>{film.nameRu || film.nameOriginal}</h2>
          <p>{film.description || 'Описание отсутствует.'}</p>
          {film.ratingKinopoisk && (
            <p>
              Рейтинг КиноПоиск:{' '}
              <span style={{ color: getRatingColor(film.ratingKinopoisk) }}>
                {film.ratingKinopoisk}
              </span>
            </p>
          )}
          {film.year && <p>Год выхода: {film.year}</p>}
          {film.genres && film.genres.length > 0 && (
            <p>Жанры: {film.genres.map(g => g.genre).join(', ')}</p>
          )}
          {film.webUrl && (
            <p>
              <a href={film.webUrl} target="_blank" rel="noopener noreferrer">
                Страница на Кинопоиске
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Плеер и кнопки */}
      <div className="player-section">
        {loadingSources ? (
          <Loading size="30px" />
        ) : sources.length > 0 ? (
          <>
            <div className="player">
              {selectedPlayerUrl ? (
                <iframe
                  src={selectedPlayerUrl}
                  frameBorder="0"
                  allowFullScreen
                  title="Desire Player"
                />
              ) : (
                <p className="status-message">Выберите плеер</p>
              )}
            </div>

            {/* Блок с надписью и кнопками */}
            <div className="sources">
              <h3 className="player-label">Плееры</h3>
              <div className="sources-row">
                {sources.map((source, index) => (
                  <button
                    key={index}
                    className={selectedPlayerUrl === source.iframeUrl ? 'selected' : ''}
                    onClick={() => setSelectedPlayerUrl(source.iframeUrl)}
                  >
                    {source.source}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p>Плееры не найдены</p>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
