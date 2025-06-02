import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
// import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Outlet /> {/* Konten halaman akan dirender di sini */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;