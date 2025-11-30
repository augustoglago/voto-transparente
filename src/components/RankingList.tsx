import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Candidate } from "@/types/election";

interface RankingListProps {
  candidates: Candidate[];
}

export const RankingList = ({ candidates }: RankingListProps) => {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  
  // Detectar empates
  const getTiedCandidates = (votes: number) => {
    return sortedCandidates.filter(c => c.votes === votes).length;
  };

  const getRankIcon = (index: number, votes: number) => {
    if (votes === 0) return null;
    
    const tiedCount = getTiedCandidates(votes);
    const isTied = tiedCount > 1;
    
    if (index === 0) {
      return (
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          {isTied && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Empate</Badge>}
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="h-6 w-6 text-warm-600" />
          {isTied && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Empate</Badge>}
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-warm-400" />
          {isTied && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Empate</Badge>}
        </div>
      );
    }
    
    if (isTied) {
      return <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Empate</Badge>;
    }
    
    return null;
  };

  return (
    <Card className="p-6 bg-card border-border shadow-elevated">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        Ranking de Votos
      </h2>
      
      {sortedCandidates.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhum candidato na votação
        </p>
      ) : (
        <div className="space-y-3">
          {sortedCandidates.map((candidate, index) => {
            const position = index + 1;
            const icon = getRankIcon(index, candidate.votes);
            
            return (
              <div
                key={candidate.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  index === 0 && candidate.votes > 0
                    ? "bg-primary/5 border-2 border-primary/20"
                    : "bg-muted/30 border border-border"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
                    {position}º
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-lg">
                      {candidate.name}
                    </div>
                  </div>
                  {icon && <div className="flex items-center">{icon}</div>}
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-primary">
                    {candidate.votes}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    {candidate.votes === 1 ? "voto" : "votos"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
