import { useEffect, useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import FloatingDock from '../components/navigation/FloatingDock';

const MainLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen text-zest-text bg-[radial-gradient(circle_at_20%_0%,rgba(255,122,26,0.16),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(34,197,94,0.12),transparent_25%),#0f1115]">
      {!isMobile && <Navbar />}
      <main className={`${isMobile ? 'pb-24' : 'pt-20'} min-h-screen`}>
        {children}
      </main>
      {isMobile && <FloatingDock />}
    </div>
  );
};

export default MainLayout;
