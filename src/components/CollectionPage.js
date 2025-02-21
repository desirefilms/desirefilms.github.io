import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFilmCollections } from '../api';
import Loading from './Loading';

function CollectionPage() {
  const navigate = useNavigate();
  const [collection] = useState('TOP_POPULAR_ALL'); 
  const [page, setPage] = useState(1);
  const [collectionsData, setCollectionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFilmCollections(collection, page)
      .then(data => {
        setCollectionsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [collection, page]);

  // Локально сохраняем "последний просмотр" при клике
  const handleFilmClick = (film) => {
    const filmData = {
      kinopoiskId: film.kinopoiskId,
      title: film.nameRu || film.nameOriginal || 'Без названия',
      year: film.year || '',
      poster: film.posterUrlPreview || film.posterUrl || '/assets/placeholder.jpg'
    };
    localStorage.setItem('lastWatchedFilm', JSON.stringify(filmData));
    navigate(`/film/${filmData.kinopoiskId}`);
  };

  // Пагинация
  const renderPagination = () => {
    if (!collectionsData || !collectionsData.totalPages || collectionsData.totalPages <= 1)
      return null;
    const pages = [];
    for (let i = 1; i <= collectionsData.totalPages; i++) {
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
    <div className="collection-page container">
      <h2>Подборки фильмов</h2>
      {loading ? (
        <Loading size="30px" />
      ) : collectionsData && collectionsData.items && collectionsData.items.length > 0 ? (
        <>
          <div className="film-list">
            {collectionsData.items.map((film) => {
              const title = film.nameRu || film.nameOriginal || 'Без названия';
              const year = film.year ? ` (${film.year})` : '';
              return (
                <div
                  key={film.kinopoiskId}
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
        <p>Подборки не найдены</p>
      )}
    </div>
  );
}

export default CollectionPage;
