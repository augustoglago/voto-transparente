import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface VoteCardProps {
  name: string;
  votes: number;
  onAddVote: () => void;
  onRemoveVote: () => void;
}

export const VoteCard = ({ name, votes, onAddVote, onRemoveVote }: VoteCardProps) => {
  return (
    <Card className="p-6 bg-card border-border hover:shadow-elevated transition-all duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">{name}</h3>
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
      <div className="text-center py-4">
        <div className="text-7xl font-bold text-primary mb-3 transition-all duration-300 group-hover:scale-105">
          {votes}
        </div>
        <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
          {votes === 1 ? "Voto" : "Votos"}
        </div>
      </div>
    </Card>
  );
};
