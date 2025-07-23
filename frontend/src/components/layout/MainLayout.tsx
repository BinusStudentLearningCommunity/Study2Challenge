import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Konten halaman akan dirender di sini */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;