import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { CollaborationRoom } from '@/components/CollaborationRoom';
import { ArtistProfile } from '@/components/ArtistProfile';

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'studio' | 'profile'>('hero');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
    setCurrentView('profile');
  };

  const handleGetStarted = () => {
    if (isWalletConnected) {
      setCurrentView('studio');
    } else {
      handleWalletConnect();
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'studio':
        return (
          <div className="p-6">
            <CollaborationRoom 
              projectName="Neon Dreams"
              collaborators={['Alice', 'Bob']}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <ArtistProfile />
          </div>
        );
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onWalletConnect={handleWalletConnect}
        isWalletConnected={isWalletConnected}
      />
      {renderContent()}
    </div>
  );
};

export default Index;
