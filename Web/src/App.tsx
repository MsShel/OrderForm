import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList'; // Компонент для списка заказов

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Главная страница со списком заказов */}
                <Route path="/" element={<OrderList />} />
                <Route path="/orders" element={<p>Not Found</p>} />
            </Routes>
        </Router>
    );
};

export default App;
