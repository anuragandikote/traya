import React from 'react';

const Header: React.FC = () => (
  <header className="bg-[#434244] w-full py-3 px-2 md:py-4 md:px-4">
    <div className="max-w-8xl mx-auto px-2 sm:px-4 md:px-6 flex flex-col items-start md:items-start lg:items-start">
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold m-0">Traya.</h1>
      <p className="text-white text-xs sm:text-sm md:text-base mt-1 md:mt-2">
        This hair test is co-created with experts
      </p>
    </div>
  </header>
);

export default Header;