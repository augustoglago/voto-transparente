import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
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

interface VoteCardProps {
  name: string;
  votes: number;
  onAddVote: () => void;
  onRemoveVote: () => void;
  onDelete: () => void;
  onEdit: (newName: string) => void;
}

export const VoteCard = ({
  name,
  votes,
  onAddVote,
  onRemoveVote,
  onDelete,
  onEdit,
}: VoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== name) {
      onEdit(editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <Card className="p-6 bg-card border-border hover:shadow-elevated transition-all duration-300 group relative flex flex-col justify-between">
      {/* Bloco de Votos e Botões de Ação */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1 pr-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="text-xl font-semibold h-8"
              autoFocus
            />
            <Button
              onClick={handleSaveEdit}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
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
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <Button
              onClick={() => setIsEditing(true)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Editar nome"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            onClick={onRemoveVote}
            size="icon"
            variant="outline"
            disabled={votes === 0}
            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 disabled:opacity-30"
            title="Remover voto"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            onClick={onAddVote}
            size="icon"
            className="bg-gradient-warm hover:opacity-90 transition-opacity shadow-soft"
            title="Adicionar voto"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Placar de Votos */}
      <div className="text-center py-4 flex-grow">
        <div className="text-7xl font-bold text-primary mb-3 transition-all duration-300 group-hover:scale-105">
          {votes}
        </div>
        <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
          {votes === 1 ? "Voto" : "Votos"}
        </div>
      </div>

      {/* 🗑️ NOVO: Botão de Excluir no Canto Inferior Direito */}
      <div className="flex justify-end pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm" // Ajustado para ser menor
              variant="link" // Mais discreto, como um link/botão secundário
              className="p-0 h-7 text-destructive/70 hover:text-destructive hover:bg-transparent transition-colors"
              title="Excluir candidato"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir <strong>{name}</strong>? Esta
                ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};
