import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <div className="logo">
        {/* PNG-логотип */}
        <img src="/assets/nigga.png" alt="" />
      </div>
      <h1>Desire — ваш проводник в мир развлечений!</h1>
      <nav>
        <button onClick={() => navigate('/')}>Поиск</button>
        <button onClick={() => navigate('/collections')}>Подборки</button>
		<button onClick={() => navigate('/filters')}>Фильтр</button>
      </nav>
    </header>
  );
}

export default Header;
