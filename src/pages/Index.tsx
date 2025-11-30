import { useState } from "react";
import { VoteCard } from "@/components/VoteCard";
import { AddCandidateDialog } from "@/components/AddCandidateDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "João Silva", votes: 0 },
    { id: "2", name: "Maria Santos", votes: 0 },
    { id: "3", name: "Pedro Oliveira", votes: 0 },
  ]);

  const handleAddVote = (id: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
    toast.success("Voto registrado com sucesso!");
  };

  const handleAddCandidate = (name: string) => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name,
      votes: 0,
    };
    setCandidates((prev) => [...prev, newCandidate]);
    toast.success(`${name} adicionado à votação`);
  };

  const handleReset = () => {
    setCandidates((prev) =>
      prev.map((candidate) => ({ ...candidate, votes: 0 }))
    );
    toast.info("Votação reiniciada");
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <AddCandidateDialog onAdd={handleAddCandidate} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <VoteCard
              key={candidate.id}
              name={candidate.name}
              votes={candidate.votes}
              onAddVote={() => handleAddVote(candidate.id)}
            />
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhum candidato adicionado ainda. Clique em "Adicionar Candidato" para começar.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Sistema de votação transparente para assembleias
        </div>
      </footer>
    </div>
  );
};

export default Index;
