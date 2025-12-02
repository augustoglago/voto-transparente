import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Edit2, Check, X } from "lucide-react";
import { Position } from "@/types/election";
import { useState } from "react";

interface PositionSelectorProps {
  positions: Position[];
  currentPosition: Position;
  onSelectPosition: (positionId: string) => void;
  onAddPosition: (name: string) => void;
  onEditPosition: (positionId: string, newName: string) => void;
}

export const PositionSelector = ({
  positions,
  currentPosition,
  onSelectPosition,
  onAddPosition,
  onEditPosition,
}: PositionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPositionName.trim()) {
      onAddPosition(newPositionName.trim());
      setNewPositionName("");
      setOpen(false);
    }
  };

  const handleStartEdit = (position: Position) => {
    setEditingId(position.id);
    setEditedName(position.name);
  };

  const handleSaveEdit = (positionId: string) => {
    if (editedName.trim() && editedName !== positions.find(p => p.id === positionId)?.name) {
      onEditPosition(positionId, editedName.trim());
    }
    setEditingId(null);
    setEditedName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedName("");
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
        const isEditing = editingId === position.id;
        
        if (isEditing) {
          return (
            <div key={position.id} className="flex items-center gap-1 border border-border rounded-md p-1 bg-background">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(position.id);
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="h-8 text-sm"
                autoFocus
              />
              <Button
                onClick={() => handleSaveEdit(position.id)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-accent hover:text-accent hover:bg-accent/20"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleCancelEdit}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        
        return (
          <div key={position.id} className="relative group/position">
            <Button
              variant={isActive ? "default" : "outline"}
              onClick={() => onSelectPosition(position.id)}
              className={`${isActive ? "bg-gradient-warm" : ""} relative pr-8`}
            >
              {position.name}
              {totalVotes > 0 && (
                <Badge variant="secondary" className="ml-2 bg-background/20">
                  {totalVotes}
                </Badge>
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(position);
                }}
                className="absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover/position:opacity-100 transition-opacity hover:bg-background/20 cursor-pointer"
                title="Editar cargo"
              >
                <Edit2 className="h-3 w-3" />
              </span>
            </Button>
          </div>
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
