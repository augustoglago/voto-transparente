import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase } from "lucide-react";
import { Position } from "@/types/election";
import { useState } from "react";

interface PositionSelectorProps {
  positions: Position[];
  currentPosition: Position;
  onSelectPosition: (positionId: string) => void;
  onAddPosition: (name: string) => void;
}

export const PositionSelector = ({
  positions,
  currentPosition,
  onSelectPosition,
  onAddPosition,
}: PositionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPositionName.trim()) {
      onAddPosition(newPositionName.trim());
      setNewPositionName("");
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Cargo:</span>
      </div>
      
      {positions.map((position) => {
        const totalVotes = position.candidates.reduce((sum, c) => sum + c.votes, 0);
        const isActive = position.id === currentPosition.id;
        
        return (
          <Button
            key={position.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onSelectPosition(position.id)}
            className={isActive ? "bg-gradient-warm" : ""}
          >
            {position.name}
            {totalVotes > 0 && (
              <Badge variant="secondary" className="ml-2 bg-background/20">
                {totalVotes}
              </Badge>
            )}
          </Button>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cargo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPosition} className="space-y-4">
            <div>
              <Label htmlFor="position-name">Nome do Cargo</Label>
              <Input
                id="position-name"
                value={newPositionName}
                onChange={(e) => setNewPositionName(e.target.value)}
                placeholder="Ex: Diácono, Presbítero, Pastor..."
                className="mt-2"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-warm hover:opacity-90">
              Adicionar Cargo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
