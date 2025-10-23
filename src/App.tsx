import React from 'react';
import './App.css';
import ContentList from './components/ContentList';
import { BrowserRouter } from "react-router-dom";
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/Search';
import SortDropdown from './components/SortDropdown';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d0d0d] text-white px-6">
        <Header />

        <main className="max-w-7xl mx-auto mt-6 space-y-6">
          <SearchBar />
          <FilterPanel />
          <SortDropdown />
          <ContentList />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
