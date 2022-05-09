import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import {HomePage, SessionPage, InterventionPage, EditSessionPage, ViewSessionPage} from './pages/index';



const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<InterventionPage />} />
                <Route path="/edit" element={<EditSessionPage />} />
                <Route path="/view" element={<ViewSessionPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;