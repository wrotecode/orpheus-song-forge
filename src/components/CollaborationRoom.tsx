import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Play, 
  Pause, 
  Users, 
  Award, 
  Share2, 
  Music, 
  Mic,
  Volume2,
  Download
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: string;
  size: string;
  status: 'uploading' | 'ready' | 'playing';
}

interface CollaborationRoomProps {
  projectName: string;
  collaborators: string[];
}

export const CollaborationRoom = ({ projectName, collaborators }: CollaborationRoomProps) => {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Main Melody.wav',
      artist: 'Alice',
      duration: '3:42',
      size: '12.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Bass Line.mp3',
      artist: 'Bob',
      duration: '3:42',
      size: '8.7 MB',
      status: 'ready'
    }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const togglePlayback = (trackId?: string) => {
    if (trackId) {
      setCurrentTrack(trackId);
    }
    setIsPlaying(!isPlaying);
  };

  const ownershipSplits = [
    { artist: 'Alice', percentage: 60, color: 'bg-primary' },
    { artist: 'Bob', percentage: 40, color: 'bg-accent' }
  ];

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{projectName}</h2>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-success/20 text-success">
              <Award className="w-3 h-3 mr-1" />
              NFT Registered
            </Badge>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{collaborators.length} Collaborators</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="music">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Track List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-primary" />
                <span>Project Tracks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/30">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePlayback(track.id)}
                      className="text-primary hover:bg-primary/20"
                    >
                      {isPlaying && currentTrack === track.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-muted-foreground">
                        by {track.artist} • {track.duration} • {track.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <div className="w-20 h-1 bg-muted rounded-full">
                      <div className="w-3/4 h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Drop your audio files here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <Button variant="outline" className="mt-4">
                  <Mic className="w-4 h-4 mr-2" />
                  Record New Track
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Collaborators */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Collaborators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {collaborator[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{collaborator}</p>
                    <Badge variant="secondary" className="text-xs">Online</Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3">
                <Users className="w-4 h-4 mr-2" />
                Invite Artist
              </Button>
            </CardContent>
          </Card>

          {/* Ownership Splits */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Ownership NFT</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {ownershipSplits.map((split, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{split.artist}</span>
                      <span className="text-muted-foreground">{split.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${split.color} transition-all duration-500`}
                        style={{ width: `${split.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">NFT Certificate ID</p>
                <p className="font-mono text-sm bg-muted/50 p-2 rounded break-all">
                  0x1a2b3c4d...8e9f
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};