import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
// import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* Konten halaman akan dirender di sini */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;