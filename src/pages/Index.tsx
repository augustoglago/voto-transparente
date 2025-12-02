import { useState } from "react";
import { VoteCard } from "@/components/VoteCard";
import { VoteList } from "@/components/VoteList";
import { AddCandidateDialog } from "@/components/AddCandidateDialog";
import { RankingList } from "@/components/RankingList";
import { PositionSelector } from "@/components/PositionSelector";
import { BiblicalInfoDialog } from "@/components/BiblicalInfoDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download, LayoutGrid, List, Moon, Sun } from "lucide-react";
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
import { toast } from "sonner";
import { Position } from "@/types/election";
import { useTheme } from "next-themes";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      name: "Diácono",
      candidates: [
      ],
    },
    {
      id: "2",
      name: "Presbítero",
      candidates: [
      ],
    },
  ]);

  const [currentPositionId, setCurrentPositionId] = useState(positions[0].id);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const handleDeleteCandidate = (candidateId: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: position.candidates.filter((c) => c.id !== candidateId),
            }
          : position
      )
    );
    toast.success("Candidato excluído");
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

  const handleEditPosition = (positionId: string, newName: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === positionId ? { ...position, name: newName } : position
      )
    );
    toast.success("Cargo renomeado com sucesso");
  };

  const handleEditCandidate = (candidateId: string, newName: string) => {
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: position.candidates.map((candidate) =>
                candidate.id === candidateId
                  ? { ...candidate, name: newName }
                  : candidate
              ),
            }
          : position
      )
    );
    toast.success("Nome atualizado com sucesso");
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text("Resultados da Votação", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Assembleia para Eleição de Cargos", 105, 30, { align: "center" });
    
    let yPosition = 45;
    
    // Para cada cargo
    positions.forEach((position, index) => {
      if (index > 0) yPosition += 10;
      
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(position.name, 20, yPosition);
      yPosition += 5;
      
      const sortedCandidates = [...position.candidates].sort((a, b) => b.votes - a.votes);
      const totalVotesForPosition = sortedCandidates.reduce((sum, c) => sum + c.votes, 0);
      
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Total de votos: ${totalVotesForPosition}`, 20, yPosition);
      yPosition += 10;
      
      // Tabela de candidatos
      const tableData = sortedCandidates.map((candidate, idx) => [
        `${idx + 1}º`,
        candidate.name,
        candidate.votes.toString(),
        totalVotesForPosition > 0 
          ? `${((candidate.votes / totalVotesForPosition) * 100).toFixed(1)}%`
          : "0%"
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [["Posição", "Candidato", "Votos", "Percentual"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [237, 108, 2] },
        margin: { left: 20, right: 20 },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 10;
      
      // Nova página se necessário
      if (yPosition > 250 && index < positions.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Gerado em ${new Date().toLocaleString("pt-BR")}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }
    
    doc.save(`votacao-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF exportado com sucesso!");
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
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hover:bg-accent/10 hover:text-accent hover:border-accent/20"
                  title="Alternar tema"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExportPDF}
                  className="hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                  title="Exportar resultados em PDF"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                      title="Resetar votação atual"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar reset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja zerar todos os votos de <strong>{currentPosition.name}</strong>? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReset}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Resetar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <PositionSelector
              positions={positions}
              currentPosition={currentPosition}
              onSelectPosition={setCurrentPositionId}
              onAddPosition={handleAddPosition}
              onEditPosition={handleEditPosition}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-foreground">
                {currentPosition.name}
              </h2>
              <BiblicalInfoDialog positionName={currentPosition.name} />
            </div>
            <p className="text-muted-foreground">
              Selecione os candidatos para registrar seus votos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
                title="Visualização em quadros"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-8 w-8"
                title="Visualização em lista"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <AddCandidateDialog onAdd={handleAddCandidate} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentPosition.candidates.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed border-border shadow-soft">
                <p className="text-muted-foreground text-lg mb-2">
                  Nenhum candidato adicionado para {currentPosition.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Clique em "Adicionar Candidato" para começar
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPosition.candidates.map((candidate) => (
                  <VoteCard
                    key={candidate.id}
                    name={candidate.name}
                    votes={candidate.votes}
                    onAddVote={() => handleAddVote(candidate.id)}
                    onRemoveVote={() => handleRemoveVote(candidate.id)}
                    onDelete={() => handleDeleteCandidate(candidate.id)}
                    onEdit={(newName) => handleEditCandidate(candidate.id, newName)}
                  />
                ))}
              </div>
            ) : (
              <VoteList
                candidates={currentPosition.candidates}
                onAddVote={handleAddVote}
                onRemoveVote={handleRemoveVote}
                onDelete={handleDeleteCandidate}
                onEdit={handleEditCandidate}
              />
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
