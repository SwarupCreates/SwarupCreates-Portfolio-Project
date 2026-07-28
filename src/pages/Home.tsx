import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { BuiltTwice } from '../components/BuiltTwice/BuiltTwice';
import { PlaceholderSection } from '../components/PlaceholderSection/PlaceholderSection';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <BuiltTwice />
      <PlaceholderSection />
      <PlaceholderSection />
      <PlaceholderSection />
    </>
  );
};
