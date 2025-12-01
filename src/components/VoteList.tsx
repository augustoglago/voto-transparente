import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/types/election";
import { Plus, Minus, Trash2, Edit2, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface VoteListProps {
  candidates: Candidate[];
  onAddVote: (candidateId: string) => void;
  onRemoveVote: (candidateId: string) => void;
  onDelete: (candidateId: string) => void;
  onEdit: (candidateId: string, newName: string) => void;
}

export const VoteList = ({
  candidates,
  onAddVote,
  onRemoveVote,
  onDelete,
  onEdit,
}: VoteListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setEditName(candidate.name);
  };

  const handleSaveEdit = (candidateId: string) => {
    if (editName.trim()) {
      onEdit(candidateId, editName.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <Card className="p-6 bg-card border-border shadow-elevated">
      <div className="space-y-2">
        {sortedCandidates.map((candidate, index) => (
          <div
            key={candidate.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors group hover:bg-muted/50 ${
              index === 0 && candidate.votes > 0
                ? "bg-primary/5 border-primary/20"
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-xl font-bold text-muted-foreground w-8 text-center">
                {index + 1}º
              </div>
              
              {editingId === candidate.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(candidate.id);
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSaveEdit(candidate.id)}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-semibold text-foreground text-lg">
                    {candidate.name}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleStartEdit(candidate)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {candidate.votes}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {candidate.votes === 1 ? "voto" : "votos"}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onAddVote(candidate.id)}
                  className="h-10 w-10 hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onRemoveVote(candidate.id)}
                  disabled={candidate.votes === 0}
                  className="h-10 w-10 hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir candidato?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir {candidate.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(candidate.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
