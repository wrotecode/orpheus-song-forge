import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Music, Users, Settings, Home } from 'lucide-react';

interface NavigationProps {
  onWalletConnect: () => void;
  isWalletConnected: boolean;
}

export const Navigation = ({ onWalletConnect, isWalletConnected }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'studio', label: 'Studio', icon: Music },
    { id: 'collaborate', label: 'Collaborate', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-lg">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Orpheus
            </h1>
            <p className="text-xs text-muted-foreground">Music Collaboration Studio</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isWalletConnected ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Artist Profile</p>
              <p className="text-xs text-muted-foreground">0x1234...5678</p>
            </div>
          </div>
        ) : (
          <Button variant="wallet" onClick={onWalletConnect} className="flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </Button>
        )}
      </div>
    </nav>
  );
};