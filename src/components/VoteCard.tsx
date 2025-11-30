import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
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
}

export const VoteCard = ({
  name,
  votes,
  onAddVote,
  onRemoveVote,
  onDelete,
}: VoteCardProps) => {
  return (
    <Card className="p-6 bg-card border-border hover:shadow-elevated transition-all duration-300 group relative flex flex-col justify-between">
      {/* Bloco de Votos e Botões de Ação */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground pr-8">{name}</h3>
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
