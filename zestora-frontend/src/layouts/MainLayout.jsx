import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import FloatingDock from '../components/navigation/FloatingDock';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hideDockRoutes = ['/support'];
  const shouldHideDock = isMobile && hideDockRoutes.includes(location.pathname);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen text-zest-text bg-zest-dark">
      {!isMobile && <Navbar />}
      <main className={`${isMobile ? (shouldHideDock ? 'pb-4' : 'pb-24') : 'pt-20'} min-h-screen`}>
        {children}
      </main>
      {isMobile && !shouldHideDock && <FloatingDock />}
    </div>
  );
};

export default MainLayout;
