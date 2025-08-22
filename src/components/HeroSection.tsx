import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Zap, Shield, Music } from 'lucide-react';
import heroImage from '@/assets/hero-music-studio.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <img 
          src={heroImage} 
          alt="Futuristic music studio" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-primary/30">
          <Zap className="w-4 h-4 mr-2" />
          Powered by ICP Blockchain
        </Badge>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Orpheus
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground/90">
          The World's First Decentralized Music Studio
        </h2>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Where musicians never lose their work, never lose ownership, and never lose revenue. 
          Collaborate, create, and distribute music on the blockchain.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={onGetStarted}
            className="text-lg px-8 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Creating
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="text-lg px-8 py-4"
          >
            <Music className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300">
            <Shield className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Never Lose Work</h3>
            <p className="text-sm text-muted-foreground">On-chain autosave ensures your music is永 protected</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300">
            <Music className="w-8 h-8 text-accent mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">True Ownership</h3>
            <p className="text-sm text-muted-foreground">NFT certificates prove your rights and splits</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300">
            <Zap className="w-8 h-8 text-music-accent mb-3 mx-auto" />
            <h3 className="font-semibold mb-2">Direct Payments</h3>
            <p className="text-sm text-muted-foreground">No intermediaries, transparent revenue sharing</p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-accent rounded-full animate-float opacity-80" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-music-accent rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};