import React from 'react';
import Hero from '../components/hero';
import FeaturedProperties from '../components/FeaturedProperties/FeaturedProperties';
import About from '../components/About';
import SearchBar from '../components/SearchBar';
import PublishSection from '../components/PublishSection';


// ...existing code...
const Home: React.FC = () => {
  return (
    <main className="home-page">
      <Hero />
      <SearchBar />
      <FeaturedProperties />
      <About />
      <br />
      <br />
      <PublishSection />
    </main>
  );
};

export default Home;