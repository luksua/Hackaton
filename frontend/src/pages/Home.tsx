import React from 'react';
import Hero from '../components/hero';
import FeaturedProperties from '../components/FeaturedProperties/FeaturedProperties';
import About from '../components/About';
import SearchBar from '../components/SearchBar';
import PublishSection from '../components/PublishSection';
import ChatButton from '../components/Chat/ChatButton';






const Home: React.FC = () => {
  return (
    <main className="home-page position-relative">
      <Hero />
      <SearchBar />
      <FeaturedProperties />
      <About />
      <br />
      <PublishSection />

      {/* Chat flotante */}
      <ChatButton />
    </main>
  );
};
export default Home;