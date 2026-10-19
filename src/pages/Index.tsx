import { useEffect, useState } from "react";
import { VoteCard } from "@/components/VoteCard";
import { VoteList } from "@/components/VoteList";
import { AddCandidateDialog } from "@/components/AddCandidateDialog";
import { RankingList } from "@/components/RankingList";
import { PositionSelector } from "@/components/PositionSelector";
import { BiblicalInfoDialog } from "@/components/BiblicalInfoDialog";
import { Button } from "@/components/ui/button";
import { Vote, RotateCcw, Download, LayoutGrid, List, Moon, Sun, UsersRound, BriefcaseBusiness, ChartNoAxesColumnIncreasing, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Position } from "@/types/election";
import { useTheme } from "next-themes";
import { normalizeName, rankCandidates } from "@/lib/election";
import { exportResults } from "@/lib/export-results";

const Index = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [positions, setPositions] = useState<Position[]>([{ id: "1", name: "Diácono", candidates: [] }, { id: "2", name: "Presbítero", candidates: [] }]);
  const [currentPositionId, setCurrentPositionId] = useState("1");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const currentPosition = positions.find(p => p.id === currentPositionId) || positions[0];
  const hasData = positions.some(p => p.candidates.length > 0);
  useEffect(() => {
    if (!hasData) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasData]);
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
    if (currentPosition.candidates.some(c => normalizeName(c.name) === normalizeName(name))) { toast.error("Já existe um candidato com esse nome neste cargo."); return; }
    setPositions((prev) =>
      prev.map((position) =>
        position.id === currentPositionId
          ? {
              ...position,
              candidates: [
                ...position.candidates,
                {
                  id: crypto.randomUUID(),
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
    if (positions.some(p => normalizeName(p.name) === normalizeName(name))) { toast.error("Já existe um cargo com esse nome."); return; }
    const newPosition: Position = {
      id: crypto.randomUUID(),
      name,
      candidates: [],
    };
    setPositions((prev) => [...prev, newPosition]);
    setCurrentPositionId(newPosition.id);
    toast.success(`Cargo "${name}" criado com sucesso`);
  };

  const handleEditPosition = (positionId: string, newName: string) => {
    if (!newName.trim() || positions.some(p => p.id !== positionId && normalizeName(p.name) === normalizeName(newName))) { toast.error("Escolha um nome de cargo diferente."); return; }
    setPositions((prev) =>
      prev.map((position) =>
        position.id === positionId ? { ...position, name: newName } : position
      )
    );
    toast.success("Cargo renomeado com sucesso");
  };

  const handleEditCandidate = (candidateId: string, newName: string) => {
    if (!newName.trim() || currentPosition.candidates.some(c => c.id !== candidateId && normalizeName(c.name) === normalizeName(newName))) { toast.error("Escolha um nome de candidato diferente."); return; }
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


  const totalVotes = currentPosition.candidates.reduce((sum, c) => sum + c.votes, 0);
  const ties = new Set(rankCandidates(currentPosition.candidates).filter(c => c.tied).map(c => c.votes)).size;
  const exportPDF = () => { try { exportResults(positions); toast.success("Resultados exportados em PDF."); } catch { toast.error("Não foi possível exportar. Tente novamente."); } };
  return <div className="flex min-h-screen flex-col bg-background">
    <header className="border-b border-border bg-card"><div className="app-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4"><a href="/" className="flex items-center gap-3" aria-label="Assembleia, início"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Vote size={23} strokeWidth={1.7} /></div><div><span className="block text-lg font-semibold">assembleia<span className="text-primary">.</span></span><span className="block text-[11px] text-muted-foreground">Unidos em cada decisão</span></div></a><div className="flex items-center gap-2"><span className="mr-4 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><ShieldCheck className="h-3.5 w-3.5" />Transparência na apuração</span><Button variant="ghost" size="icon" title="Alternar tema" aria-label="Alternar tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{resolvedTheme === "dark" ? <Sun /> : <Moon />}</Button><span className="mx-1 h-5 border-l border-border" /><Button variant="outline" onClick={exportPDF}><Download />Exportar PDF</Button></div></div></header>
    <main className="app-shell flex-1 pb-12 pt-9 page-enter">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="eyebrow mb-3">ELEIÇÃO DE CARGOS · ASSEMBLEIA DA IGREJA</div><h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Apuração da assembleia</h1></div><div className="mt-1 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Apuração</div></div>
      <div className="my-8 grid grid-cols-2 divide-x divide-border border-y border-border lg:grid-cols-4"><div className="stat pr-3"><span className="stat-icon"><Vote size={19} /></span><div><p className="eyebrow">Votos neste cargo</p><p className="mt-1 text-2xl font-semibold tabular-nums">{totalVotes.toLocaleString("pt-BR")}</p></div></div><div className="stat pl-5"><span className="stat-icon"><UsersRound size={19} /></span><div><p className="eyebrow">Candidatos</p><p className="mt-1 text-2xl font-semibold">{currentPosition.candidates.length}</p></div></div><div className="stat !border-l-0 pr-3 lg:!border-l lg:pl-5"><span className="stat-icon"><BriefcaseBusiness size={19} /></span><div><p className="eyebrow">Cargos em votação</p><p className="mt-1 text-2xl font-semibold">{positions.length}</p></div></div><div className="stat pl-5"><span className="stat-icon"><ChartNoAxesColumnIncreasing size={19} /></span><div><p className="eyebrow">Grupos em empate</p><p className="mt-1 text-2xl font-semibold">{ties}</p></div></div></div>
      <PositionSelector positions={positions} currentPosition={currentPosition} onSelectPosition={setCurrentPositionId} onAddPosition={handleAddPosition} onEditPosition={handleEditPosition} />
      <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]"><section className="min-w-0"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><div className="flex flex-wrap items-center gap-3"><h2 className="break-words text-xl font-semibold">{currentPosition.name}</h2><BiblicalInfoDialog positionName={currentPosition.name} /></div><p className="mt-2 text-xs text-muted-foreground">{currentPosition.candidates.length} candidatos · {totalVotes} votos contabilizados</p></div><div className="flex flex-wrap items-center gap-2"><div className="flex gap-1 rounded-lg border border-border bg-card p-1"><Button size="icon" variant={viewMode === "grid" ? "secondary" : "ghost"} className="h-8 w-8" title="Visualização em quadros" aria-label="Visualização em quadros" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><LayoutGrid /></Button><Button size="icon" variant={viewMode === "list" ? "secondary" : "ghost"} className="h-8 w-8" title="Visualização em lista" aria-label="Visualização em lista" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><List /></Button></div><AddCandidateDialog onAdd={handleAddCandidate} /></div></div>
      {currentPosition.candidates.length === 0 ? <div className="empty-panel"><div className="empty-ballot mb-6"><Vote className="h-9 w-9" strokeWidth={1.2} /></div><h3 className="text-lg font-semibold">Uma nova eleição começa aqui</h3><p className="mb-5 mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Nenhum candidato cadastrado para {currentPosition.name}.</p><AddCandidateDialog onAdd={handleAddCandidate} /></div> : viewMode === "grid" ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{currentPosition.candidates.map(c => <VoteCard key={c.id} name={c.name} votes={c.votes} onAddVote={() => handleAddVote(c.id)} onRemoveVote={() => handleRemoveVote(c.id)} onDelete={() => handleDeleteCandidate(c.id)} onEdit={name => handleEditCandidate(c.id, name)} />)}</div> : <VoteList key={currentPosition.id} candidates={currentPosition.candidates} onAddVote={handleAddVote} onRemoveVote={handleRemoveVote} onDelete={handleDeleteCandidate} onEdit={handleEditCandidate} />}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5" />Dados desta sessão · exporte antes de sair</span><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" disabled={totalVotes === 0} className="text-muted-foreground hover:text-destructive"><RotateCcw />Zerar votação</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Zerar votos de {currentPosition.name}?</AlertDialogTitle><AlertDialogDescription>Todos os {totalVotes} votos deste cargo serão zerados. Os candidatos e os demais cargos serão mantidos. Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleReset}>Zerar votos</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></section><div className="lg:sticky lg:top-6"><RankingList candidates={currentPosition.candidates} /><div className="mt-4 flex items-center gap-3 px-1 text-xs leading-5 text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /><p>Decisões com clareza.<br />Uma assembleia com transparência.</p></div></div></div>
    </main><footer className="mt-auto border-t border-border bg-card"><div className="app-shell flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted-foreground"><span>Sistema de votação transparente para assembleias</span><span className="flex items-center gap-2">Feito para decidir em comunhão<ArrowRight className="h-3 w-3 text-primary" /></span></div></footer>
  </div>;
};
export default Index;
