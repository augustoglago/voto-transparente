import { useState } from "react";
import { VoteCard } from "@/components/VoteCard";
import { AddCandidateDialog } from "@/components/AddCandidateDialog";
import { RankingList } from "@/components/RankingList";
import { PositionSelector } from "@/components/PositionSelector";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Position } from "@/types/election";

const Index = () => {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      name: "Diácono",
      candidates: [
        { id: "1-1", name: "João Silva", votes: 0 },
        { id: "1-2", name: "Maria Santos", votes: 0 },
        { id: "1-3", name: "Pedro Oliveira", votes: 0 },
      ],
    },
    {
      id: "2",
      name: "Presbítero",
      candidates: [
        { id: "2-1", name: "Ana Costa", votes: 0 },
        { id: "2-2", name: "Carlos Lima", votes: 0 },
      ],
    },
  ]);

  const [currentPositionId, setCurrentPositionId] = useState(positions[0].id);

  const currentPosition = positions.find((p) => p.id === currentPositionId) || positions[0];

  const handleAddVote = (candidateId: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: position.candidates.map((candidate) =>
                candidate.id === candidateId
                  ? { ...candidate, votes: candidate.votes + 1 }
                  : candidate
              ),
            }
          : position
      )
    );
    toast.success("Voto registrado com sucesso!");
  };

  const handleRemoveVote = (candidateId: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: position.candidates.map((candidate) =>
                candidate.id === candidateId && candidate.votes > 0
                  ? { ...candidate, votes: candidate.votes - 1 }
                  : candidate
              ),
            }
          : position
      )
    );
    toast.info("Voto removido");
  };

  const handleAddCandidate = (name: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: [
                ...position.candidates,
                {
                  id: `${currentPositionId}-${Date.now()}`,
                  name,
                  votes: 0,
                },
              ],
            }
          : position
      )
    );
    toast.success(`${name} adicionado à votação de ${currentPosition.name}`);
  };

  const handleAddPosition = (name: string) => {
    const newPosition: Position = {
      id: Date.now().toString(),
      name,
      candidates: [],
    };
    setPositions((prev) => [...prev, newPosition]);
    setCurrentPositionId(newPosition.id);
    toast.success(`Cargo "${name}" criado com sucesso`);
  };

  const handleReset = () => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: position.candidates.map((c) => ({ ...c, votes: 0 })),
            }
          : position
      )
    );
    toast.info(`Votação de ${currentPosition.name} reiniciada`);
  };

  const totalVotes = currentPosition.candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Sistema de Votação
                </h1>
                <p className="text-muted-foreground">
                  Assembleia para Eleição de Cargos
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center px-6 py-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-3xl font-bold text-primary">{totalVotes}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total de Votos
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                  title="Resetar votação atual"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <PositionSelector
              positions={positions}
              currentPosition={currentPosition}
              onSelectPosition={setCurrentPositionId}
              onAddPosition={handleAddPosition}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {currentPosition.name}
            </h2>
            <p className="text-muted-foreground">
              Selecione os candidatos para registrar seus votos
            </p>
          </div>
          <AddCandidateDialog onAdd={handleAddCandidate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPosition.candidates.map((candidate) => (
                <VoteCard
                  key={candidate.id}
                  name={candidate.name}
                  votes={candidate.votes}
                  onAddVote={() => handleAddVote(candidate.id)}
                  onRemoveVote={() => handleRemoveVote(candidate.id)}
                />
              ))}
            </div>

            {currentPosition.candidates.length === 0 && (
              <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border shadow-soft">
                <p className="text-muted-foreground text-lg mb-2">
                  Nenhum candidato adicionado para {currentPosition.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Clique em "Adicionar Candidato" para começar
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <RankingList candidates={currentPosition.candidates} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
          Sistema de votação transparente para assembleias
        </div>
      </footer>
    </div>
  );
};

export default Index;
