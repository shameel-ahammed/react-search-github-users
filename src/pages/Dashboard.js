import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext,useGlobelContext } from '../context/context';
const Dashboard = () => {
  const {loading} = useGlobelContext()

  if(loading){
    return (
      <main>
        <Navbar></Navbar>
        <Search />
        <img src={loadingImage} alt='loading' className='loading-img' />
      </main>
    )
  }
  return (
    <main>
      <Navbar></Navbar>
      <Search />
      <Info/>
      <User />
      <Repos/>
    </main>
  );
};

export default Dashboard;
