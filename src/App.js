import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './components/SearchPage';
import DetailPage from './components/DetailPage';
import CollectionPage from './components/CollectionPage';
import FilterPage from './components/FilterPage';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/film/:id" element={<DetailPage />} />
        <Route path="/collections" element={<CollectionPage />} />
		<Route path="/filters" element={<FilterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
