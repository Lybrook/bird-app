"use client";

import React, { useState, useMemo } from "react";
import { ASSETS, TAGLINE, CATCHPHRASE } from "@/shared/const";
import BirdCard, { type Bird } from "@/components/BirdCard";
import AddBirdDialog from "@/components/AddBirdDialog";
import FlywayMap from "@/components/FlywayMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

// Initial sample bird cards with real images and hypothetical details
const INITIAL_BIRDS: Bird[] = [
  {
    id: "1",
    name: "Lesser Flamingo",
    scientificName: "Phoeniconaias minor",
    image: ASSETS.flamingo,
    location: "Lake Nakuru & Lake Bogoria, Kenya",
    status: "Unique",
    details:
      "Known for forming spectacular rosy clouds across Kenya's alkaline lakes. Hypothetically, their vibrant pink hue is enhanced by drinking local wild hibiscus tea, allowing them to whisper migration secrets to European swallows.",
    contributor: "Charlotte from Paris",
    likes: 342,
  },
  {
    id: "2",
    name: "Lilac-breasted Roller",
    scientificName: "Coracias caudatus",
    image: ASSETS.roller,
    location: "Masai Mara National Reserve, Kenya",
    status: "Common",
    details:
      "Kenya's unofficial national bird, displaying a breathtaking palette of lilac, turquoise, and gold. Legend says they carry messages of good fortune from the African savannah directly to the cottage gardens of rural England.",
    contributor: "Elena from Florence",
    likes: 512,
  },
  {
    id: "3",
    name: "Grey Crowned Crane",
    scientificName: "Balearica regulorum",
    image: ASSETS.crane,
    location: "Amboseli & swampy wetlands, Kenya",
    status: "Endangered",
    details:
      "A majestic bird carrying a stiff crown of golden-straw feathers. According to ancient coastal lore, their rhythmic breeding dances have the magical power to summon seasonal rains and guide lost explorers safely back to camp.",
    contributor: "Beatrix from Vienna",
    likes: 219,
  },
  {
    id: "4",
    name: "Sokoke Scops Owl",
    scientificName: "Otus ireneae",
    image:
      "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?auto=format&fit=crop&w=800&q=80",
    location: "Arabuko-Sokoke Coastal Forest, Kenya",
    status: "Unique",
    details:
      "A tiny, highly elusive near-endemic owl. It is said that they only sing under the light of a full moon, and their soft whistles can only be heard by travelers who possess a truly gentle and pure spirit.",
    contributor: "Amélie from Brussels",
    likes: 188,
  },
  {
    id: "5",
    name: "Aberdare Cisticola",
    scientificName: "Cisticola aberdare",
    image:
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80",
    location: "Aberdare Mountain Range, Kenya",
    status: "Unique",
    details:
      "A charming, rare endemic bird found only in the high-altitude montane grasslands of the Aberdares. They build beautiful, intricate woven nests that resemble delicate, floating teardrops suspended in the mist.",
    contributor: "Sophia from Berlin",
    likes: 95,
  },
  {
    id: "6",
    name: "Lord Derby's Turaco",
    scientificName: "Tauraco derbianus",
    image:
      "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?auto=format&fit=crop&w=800&q=80",
    location: "Kakamega Equatorial Rainforest, Kenya",
    status: "Extinct",
    details:
      "A mythical subspecies of the great blue turaco, rumored to be extinct in the wild. Its feathers are of the deepest royal indigo, and local elders say it could speak in three languages to guide weary travelers through the jungle.",
    contributor: "Isabella from London",
    likes: 624,
  },
];

export default function Home() {
  const [birds, setBirds] = useState<Bird[]>(INITIAL_BIRDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add new bird to the list
  const handleAddBird = (newBird: Omit<Bird, "id" | "likes">) => {
    const birdWithId: Bird = {
      ...newBird,
      id: String(birds.length + 1),
      likes: 0,
    };
    setBirds([birdWithId, ...birds]);
  };

  // Like a bird card
  const handleLikeBird = (id: string) => {
    setBirds(
      birds.map(b => (b.id === id ? { ...b, likes: (b.likes || 0) + 1 } : b))
    );
  };

  // Filter birds by search query and status
  const filteredBirds = useMemo(() => {
    return birds.filter(bird => {
      const matchesSearch =
        bird.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bird.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bird.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        bird.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [birds, searchQuery, selectedStatus]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* --- HEADER & NAVIGATION --- */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/15 transition-all duration-300">
        <div className="container py-4 flex items-center justify-between mx-auto px-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <img
              src={ASSETS.logo}
              alt="AviKenya Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full border border-secondary/20 bg-card p-0.5"
            />
            <div>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-wider text-primary">
                AviKenya
              </span>
              <span className="block text-[9px] md:text-xs font-sans tracking-widest uppercase text-accent font-semibold">
                Bird Connect
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium text-foreground/80">
            <a
              href="#flyway"
              className="hover:text-primary transition-colors duration-200"
            >
              The Flyway
            </a>
            <a
              href="#discover"
              className="hover:text-primary transition-colors duration-200"
            >
              Explore Sightings
            </a>
            <a
              href="#story"
              className="hover:text-primary transition-colors duration-200"
            >
              Our Story
            </a>
            <a
              href="#community"
              className="hover:text-primary transition-colors duration-200"
            >
              Community
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium rounded-full px-5 py-2 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Log Sighting
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-secondary/15 py-4 px-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col gap-3 font-sans text-sm font-medium">
              <a
                href="#flyway"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
              >
                The Flyway
              </a>
              <a
                href="#discover"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Explore Sightings
              </a>
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Our Story
              </a>
              <a
                href="#community"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-primary transition-colors"
              >
                Community
              </a>
            </nav>
            <Button
              onClick={() => {
                setIsAddOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Log Sighting
            </Button>
          </div>
        )}
      </header>

      {/* --- HERO BANNER SECTION --- */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="container grid md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 mx-auto px-4">
          {/* Text Content */}
          <div className="md:col-span-6 space-y-6 md:space-y-8 text-left">
            <Badge className="bg-secondary/25 text-secondary-foreground border border-secondary/30 rounded-full px-4 py-1.5 font-sans font-medium text-xs md:text-sm tracking-wider uppercase">
              ✨ Connecting Europe & Kenya
            </Badge>

            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                {TAGLINE}
              </h1>
              <p className="text-base md:text-xl font-serif italic text-primary/90 font-medium">
                “{CATCHPHRASE}”
              </p>
            </div>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans max-w-lg">
              Welcome to <strong>AviKenya</strong>, a hand-crafted sanctuary
              connecting birdwatchers, conservationists, and nature lovers from
              Europe with the vibrant, wild wings of Kenya. Share real or
              hypothetical sightings, track seasonal flyways, and discover the
              rare, endemic, and legendary birds of East Africa.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#discover">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium rounded-full px-6 py-3 transition-all duration-200 active:scale-95">
                  Explore Sighting Cards
                </Button>
              </a>
              <a href="#flyway">
                <Button
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5 rounded-full px-6 py-3"
                >
                  View Migration Map
                </Button>
              </a>
            </div>
          </div>

          {/* Banner Image Visual */}
          <div className="md:col-span-6 relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-accent/20 to-secondary/20 rounded-3xl blur-2xl opacity-70" />
            <div className="relative overflow-hidden rounded-3xl border-2 border-secondary/20 shadow-2xl aspect-video">
              <img
                src={ASSETS.hero}
                alt="Kenyan Bird Sanctuary"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FLYWAY MAP SECTION --- */}
      <section
        id="flyway"
        className="py-16 md:py-20 bg-background scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <FlywayMap />
        </div>
      </section>

      {/* --- DISCOVER / BIRD CATALOG SECTION --- */}
      <section
        id="discover"
        className="py-16 md:py-20 bg-gradient-to-b from-transparent to-secondary/5 scroll-mt-20"
      >
        <div className="container space-y-8 md:space-y-12 mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-5xl font-serif text-primary font-bold">
              The Feathered Catalog
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-sans">
              Browse through our global collection of bird sightings. Created
              with stunning photography and a mix of real, historical, and
              delightful hypothetical details.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-secondary/15 p-4 md:p-6 rounded-3xl shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, scientific name, habitat..."
                className="w-full pl-10 border-border/60 bg-background/50 focus-visible:ring-primary rounded-full h-11 text-sm md:text-base"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of Birds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBirds.map(bird => (
              <BirdCard key={bird.id} bird={bird} onLike={handleLikeBird} />
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer
        id="community"
        className="bg-primary text-primary-foreground py-12 md:py-16 border-t border-primary/20 mt-auto"
      >
        <div className="container max-w-6xl mx-auto space-y-12 px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Column 1: Brand */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={ASSETS.logo}
                  alt="AviKenya Logo"
                  className="h-10 w-10 object-contain rounded-full bg-background p-0.5"
                />
                <span className="font-serif text-xl md:text-2xl font-bold tracking-wider text-white">
                  AviKenya
                </span>
              </div>
              <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed font-sans max-w-sm">
                A feminine, nature-inspired global platform connecting European
                bird enthusiasts with the natural wonders and migratory havens
                of Kenya.
              </p>
              <p className="text-xs font-serif italic text-accent">
                “{CATCHPHRASE}”
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-serif text-base md:text-lg font-bold text-white">
                Explore the Canopy
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-primary-foreground/80 font-sans">
                <li>
                  <a
                    href="#flyway"
                    className="hover:text-accent transition-colors"
                  >
                    The Great Flyway Map
                  </a>
                </li>
                <li>
                  <a
                    href="#discover"
                    className="hover:text-accent transition-colors"
                  >
                    Feathered Sighting Cards
                  </a>
                </li>
                <li>
                  <a
                    href="#story"
                    className="hover:text-accent transition-colors"
                  >
                    Our Intercontinental Story
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsAddOpen(true)}
                    className="hover:text-accent transition-colors text-left"
                  >
                    Log Sighting
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Conservation & Help */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif text-base md:text-lg font-bold text-white">
                Conservation & Community
              </h4>
              <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed font-sans">
                We support local bird guiding networks and community-led wetland
                protection programs at Mida Creek and Lake Naivasha. Join our
                newsletter to receive quarterly field reports.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-primary-foreground/50 rounded-full h-9 text-xs"
                />
                <Button
                  onClick={() =>
                    toast.success(
                      "Thank you for joining our field updates newsletter!"
                    )
                  }
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-9 px-4 text-xs font-medium"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs text-primary-foreground/60 font-sans">
            <p>
              © {new Date().getFullYear()} AviKenya Bird Connect. Hand-crafted
              with love for the wild wings of Kenya.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Sanctuary
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Flyway Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Guiding Network
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- ADD BIRD MODAL DIALOG --- */}
      <AddBirdDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddBird}
      />
    </div>
  );
}
