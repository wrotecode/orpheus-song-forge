import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Music, 
  Award, 
  Edit3, 
  Save, 
  Plus,
  Play,
  Share2,
  Calendar,
  MapPin,
  Globe
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  collaborators: string[];
  status: 'active' | 'completed';
  revenue: string;
  nftId: string;
}

export const ArtistProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alice Chen',
    bio: 'Electronic music producer and sound designer. Passionate about creating immersive soundscapes and collaborating with fellow artists worldwide.',
    location: 'Los Angeles, CA',
    website: 'alicemusic.com',
    genres: ['Electronic', 'Ambient', 'Experimental'],
    joinDate: 'January 2024'
  });

  const projects: Project[] = [
    {
      id: '1',
      name: 'Neon Dreams',
      collaborators: ['Bob', 'Charlie'],
      status: 'active',
      revenue: '0.5 ICP',
      nftId: '0x1a2b...3c4d'
    },
    {
      id: '2',
      name: 'Midnight Frequencies',
      collaborators: ['Dave'],
      status: 'completed',
      revenue: '2.3 ICP',
      nftId: '0x5e6f...7g8h'
    },
    {
      id: '3',
      name: 'Digital Harmony',
      collaborators: ['Eve', 'Frank', 'Grace'],
      status: 'active',
      revenue: '1.2 ICP',
      nftId: '0x9i0j...1k2l'
    }
  ];

  const totalRevenue = projects.reduce((sum, project) => {
    return sum + parseFloat(project.revenue.split(' ')[0]);
  }, 0);

  const saveProfile = () => {
    setIsEditing(false);
    // Mock save to blockchain
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground">
                A
              </div>
              <div className="space-y-2">
                {isEditing ? (
                  <Input 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                )}
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{profile.website}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? saveProfile : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <Textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {profile.genres.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                  {genre}
                </Badge>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Genre
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <Music className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-sm text-muted-foreground">Projects</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalRevenue.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Total ICP</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 text-music-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Collaborators</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <Share2 className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">8.4K</p>
            <p className="text-sm text-muted-foreground">Streams</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5 text-primary" />
            <span>My Projects</span>
          </CardTitle>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20">
                  <Play className="w-4 h-4" />
                </Button>
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <span>with {project.collaborators.join(', ')}</span>
                    <Badge 
                      variant="secondary" 
                      className={project.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted/50'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-accent">{project.revenue}</p>
                <p className="text-xs text-muted-foreground font-mono">{project.nftId}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};