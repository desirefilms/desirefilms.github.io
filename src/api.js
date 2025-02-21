// Замените на ваш действующий API‑ключ
const KP_API_KEY = 'b9e247a6-046e-4c29-bc5f-2b131432be36';

export async function searchFilms(query) {
  const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': KP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Ошибка поиска: ${response.status}`);
  }
  const data = await response.json();
  return data.films;
}

export async function getFilmDetails(id) {
  const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`;
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': KP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Ошибка получения деталей: ${response.status}`);
  }
  return await response.json();
}

export async function fetchStreamingSources(kinopoiskId) {
  const url = new URL('https://kinobox.tv/api/players');
  url.searchParams.set('kinopoisk', kinopoiskId);
  url.searchParams.set('sources', 'alloha,ashdi,cdnmovies,collaps,hdvb,kodik,vibix,videocdn,voidboost');
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Ошибка запроса источников: ${response.status}`);
  }
  const data = await response.json();
  return data.filter(item => item.iframeUrl && item.success && item.source);
}

export async function getFilmCollections(collection = 'TOP_POPULAR_ALL', page = 1) {
  const url = new URL('https://kinopoiskapiunofficial.tech/api/v2.2/films/collections');
  url.searchParams.set('collection', collection);
  url.searchParams.set('page', page);
  const response = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': KP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Ошибка получения подборок: ${response.status}`);
  }
  return await response.json();
}

export async function getFilmsByFilter({
  countries = '',
  genres = '',
  order = 'RATING',
  type = 'ALL',
  ratingFrom = 0,
  ratingTo = 10,
  yearFrom = 1000,
  yearTo = 3000,
  keyword = '',
  page = 1
} = {}) {
  const url = new URL('https://kinopoiskapiunofficial.tech/api/v2.2/films');
  
  if (countries) url.searchParams.set('countries', countries); // например "1"
  if (genres) url.searchParams.set('genres', genres);         // например "2"
  if (order) url.searchParams.set('order', order);           // RATING, NUM_VOTE, YEAR
  if (type) url.searchParams.set('type', type);              // FILM, TV_SHOW, TV_SERIES, MINI_SERIES, ALL
  url.searchParams.set('ratingFrom', ratingFrom);
  url.searchParams.set('ratingTo', ratingTo);
  url.searchParams.set('yearFrom', yearFrom);
  url.searchParams.set('yearTo', yearTo);
  if (keyword) url.searchParams.set('keyword', keyword);
  url.searchParams.set('page', page);

  const response = await fetch(url.toString(), {
    headers: {
      'X-API-KEY': KP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Ошибка фильтрации: ${response.status}`);
  }
  return await response.json(); // Возвращает объект { total, totalPages, items, ... }
}

export async function getFilters() {
  const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/filters';
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': KP_API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Ошибка получения списка фильтров: ${response.status}`);
  }
  return await response.json(); 
  // возвращает объект { genres: [...], countries: [...] }
}
