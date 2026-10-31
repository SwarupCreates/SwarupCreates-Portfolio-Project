import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { BuiltTwice } from '../components/BuiltTwice/BuiltTwice';
import GradualBlur from '../components/gradualBlur/GradualBlur';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <BuiltTwice />
      <GradualBlur preset="bottom" strength={2.5} height="8rem" />
    </>
  );
};
