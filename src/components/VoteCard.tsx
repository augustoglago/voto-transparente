import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VoteCardProps {
  name: string;
  votes: number;
  onAddVote: () => void;
}

export const VoteCard = ({ name, votes, onAddVote }: VoteCardProps) => {
  return (
    <Card className="p-6 bg-card border-border hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-foreground">{name}</h3>
        <Button
          onClick={onAddVote}
          size="icon"
          className="bg-gradient-warm hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-2">{votes}</div>
        <div className="text-sm text-muted-foreground uppercase tracking-wider">
          {votes === 1 ? "Voto" : "Votos"}
        </div>
      </div>
    </Card>
  );
};
