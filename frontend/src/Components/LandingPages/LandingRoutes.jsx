import Home from './Home/Home';
import Contact from './Contact/Contact';
import About from './About/About';
import Product from './Product/Product';

import React from 'react';

const LandingRoutes = () => {
  return (
    <div className="w-full">
      <section id="home" className="min-h-screen">
        <Home />
      </section>

      <section id="about" className="min-h-screen">
        <About />
      </section>

      <section id="Product" className="min-h-screen">
        <Product />
      </section>

      <section id="contact" className="min-h-screen">
        <Contact />
      </section>
    </div>
  );
};

export default LandingRoutes;