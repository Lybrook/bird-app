import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Sparkles } from "lucide-react";

interface AddBirdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bird: {
    name: string;
    scientificName: string;
    image: string;
    location: string;
    status: "Common" | "Unique" | "Extinct" | "Endangered";
    details: string;
    contributor: string;
  }) => void;
}

export default function AddBirdDialog({
  isOpen,
  onClose,
  onAdd,
}: AddBirdDialogProps) {
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<
    "Common" | "Unique" | "Extinct" | "Endangered"
  >("Common");
  const [details, setDetails] = useState("");
  const [contributor, setContributor] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !details) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Default placeholder bird image if none is provided
    const finalImage =
      imageUrl.trim() ||
      "https://images.unsplash.com/photo-1475809913362-28a064062ccd?auto=format&fit=crop&w=800&q=80";

    onAdd({
      name,
      scientificName: scientificName || "Avis hypotheticalis",
      image: finalImage,
      location,
      status,
      details,
      contributor: contributor || "Global Explorer",
    });

    toast.success(`${name} has been added to the flyway!`);

    // Reset form
    setName("");
    setScientificName("");
    setLocation("");
    setStatus("Common");
    setDetails("");
    setContributor("");
    setImageUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto border-secondary/20 bg-background text-foreground rounded-2xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-serif text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            Log a Feathered Wonder
          </DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            Share a real or hypothetical bird sighting, complete with habitats,
            unique features, or extinct statuses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label
                htmlFor="name"
                className="text-xs md:text-sm font-medium text-foreground/80"
              >
                Bird Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Flamingo Rose"
                className="border-border/60 bg-card focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label
                htmlFor="scientificName"
                className="text-xs md:text-sm font-medium text-foreground/80"
              >
                Scientific Name
              </Label>
              <Input
                id="scientificName"
                value={scientificName}
                onChange={e => setScientificName(e.target.value)}
                placeholder="e.g. Phoenicopterus roseus"
                className="border-border/60 bg-card focus-visible:ring-primary rounded-xl italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label
                htmlFor="location"
                className="text-xs md:text-sm font-medium text-foreground/80"
              >
                Main Habitat / Location *
              </Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Lake Nakuru, Kenya"
                className="border-border/60 bg-card focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label
                htmlFor="status"
                className="text-xs md:text-sm font-medium text-foreground/80"
              >
                Status *
              </Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger
                  id="status"
                  className="border-border/60 bg-card focus-visible:ring-primary rounded-xl"
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="Common">Common Sighting</SelectItem>
                  <SelectItem value="Unique">Unique / Endemic</SelectItem>
                  <SelectItem value="Endangered">Endangered</SelectItem>
                  <SelectItem value="Extinct">Extinct / Mythical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="imageUrl"
              className="text-xs md:text-sm font-medium text-foreground/80"
            >
              Image URL
            </Label>
            <div className="relative">
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Paste an Unsplash, Pinterest, or custom photo link"
                className="border-border/60 bg-card focus-visible:ring-primary rounded-xl pl-9"
              />
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="details"
              className="text-xs md:text-sm font-medium text-foreground/80"
            >
              Feather Details & Fascinating Facts *
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Describe its behavior, unique features, plumage details, or historical background..."
              className="border-border/60 bg-card focus-visible:ring-primary rounded-xl min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="contributor"
              className="text-xs md:text-sm font-medium text-foreground/80"
            >
              Your Name / Contributor Signature
            </Label>
            <Input
              id="contributor"
              value={contributor}
              onChange={e => setContributor(e.target.value)}
              placeholder="e.g. Sofia from Munich"
              className="border-border/60 bg-card focus-visible:ring-primary rounded-xl"
            />
          </div>

          <DialogFooter className="pt-4 flex flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border/60 text-muted-foreground hover:bg-muted rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium rounded-xl transition-all duration-200 active:scale-95"
            >
              Share Sighting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
