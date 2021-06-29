import React from 'react';

// importing Connect
import Connect from './Sidepane/Connect';

// importing Navbar
import NavBar from './Sidepane/NavBar';

const Sidepane = () => {
  return (
    <>
      <h1>Sidepane</h1>
      <div>
        <Connect />
      </div>
      <div>
        <NavBar />
      </div>
    </>
  );
};

export default Sidepane;
