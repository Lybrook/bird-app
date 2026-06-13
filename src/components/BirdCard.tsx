import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Sparkles,
  User,
  AlertCircle,
  Compass,
} from "lucide-react";
import { toast } from "sonner";

export interface Bird {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  location: string;
  status: "Common" | "Unique" | "Extinct" | "Endangered";
  details: string;
  contributor: string;
  likes?: number;
}

interface BirdCardProps {
  bird: Bird;
  onLike: (id: string) => void;
}

export default function BirdCard({ bird, onLike }: BirdCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike(bird.id);
    if (!isLiked) {
      toast.success(`You liked the ${bird.name}! Sighting favorited.`);
    }
  };

  const getStatusBadge = (status: Bird["status"]) => {
    switch (status) {
      case "Extinct":
        return (
          <Badge className="bg-destructive/10 text-destructive border border-destructive/20 rounded-full px-3 py-1 font-sans font-medium text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Extinct / Mythical
          </Badge>
        );
      case "Unique":
        return (
          <Badge className="bg-accent/15 text-accent-foreground border border-accent/30 rounded-full px-3 py-1 font-sans font-medium text-xs flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Unique / Endemic
          </Badge>
        );
      case "Endangered":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full px-3 py-1 font-sans font-medium text-xs flex items-center gap-1">
            <Compass className="h-3 w-3" />
            Endangered
          </Badge>
        );
      default:
        return (
          <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 font-sans font-medium text-xs flex items-center gap-1">
            <Compass className="h-3 w-3" />
            Common Sighting
          </Badge>
        );
    }
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border-secondary/15 bg-card text-card-foreground editorial-shadow-hover duration-300 relative flex flex-col h-full">
      {/* Decorative floral/organic vector background overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-secondary/5 to-transparent pointer-events-none rounded-bl-full z-0" />

      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden z-10">
        <img
          src={bird.image}
          alt={bird.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft shadow gradient over image bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Sighting Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          {getStatusBadge(bird.status)}
        </div>

        {/* Heart/Like Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleLike}
          className={`absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur-md transition-all duration-300 shadow-sm hover:bg-background ${
            isLiked
              ? "text-destructive"
              : "text-muted-foreground hover:text-destructive"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${isLiked ? "fill-current scale-110" : "scale-100"}`}
          />
        </Button>
      </div>

      {/* Content Container */}
      <CardContent className="p-5 md:p-6 flex flex-col flex-grow relative z-10 justify-between">
        <div className="space-y-3">
          {/* Title & Scientific Name */}
          <div>
            <h3 className="text-xl md:text-2xl font-serif text-foreground font-semibold group-hover:text-primary transition-colors duration-200">
              {bird.name}
            </h3>
            <p className="text-xs md:text-sm italic font-serif text-muted-foreground mt-0.5">
              {bird.scientificName}
            </p>
          </div>

          {/* Location / Habitat */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="font-sans truncate font-medium">
              {bird.location}
            </span>
          </div>

          {/* Details / Description */}
          <p className="text-xs md:text-sm text-foreground/80 font-sans leading-relaxed line-clamp-3">
            {bird.details}
          </p>
        </div>

        {/* Contributor Signature & Likes */}
        <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="h-3.5 w-3.5 text-secondary-foreground/70 shrink-0" />
            <span className="font-sans truncate italic">
              Logged by{" "}
              <span className="font-medium not-italic text-foreground/90">
                {bird.contributor}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-sans font-medium text-foreground/70 shrink-0 pl-2">
            <Heart className="h-3.5 w-3.5 text-destructive fill-destructive/20" />
            <span>{(bird.likes || 0) + (isLiked ? 1 : 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
