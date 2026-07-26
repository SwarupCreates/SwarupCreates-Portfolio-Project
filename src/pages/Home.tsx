import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { BuiltTwice } from '../components/BuiltTwice/BuiltTwice';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <BuiltTwice />
    </>
  );
};
