import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, Ellipsis, Check, X, UserRound } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface VoteCardProps {
  name: string; votes: number; onAddVote: () => void; onRemoveVote: () => void; onDelete: () => void; onEdit: (name: string) => void;
  layout?: "grid" | "list";
}
export const VoteCard = ({ name, votes, onAddVote, onRemoveVote, onDelete, onEdit, layout = "grid" }: VoteCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const save = () => { if (!draft.trim()) return; onEdit(draft.trim()); setEditing(false); };
  const list = layout === "list";
  return (
    <article className={`candidate ${list ? "candidate-list" : "candidate-grid"}`} aria-label={`Candidato ${name}`}>
      <div className="flex min-w-0 items-start gap-3">
        <div className="candidate-avatar"><UserRound size={20} strokeWidth={1.6} /></div>
        <div className="min-w-0 flex-1">
          {editing ? <div className="flex items-center gap-1"><Input aria-label="Nome do candidato" value={draft} onChange={e => setDraft(e.target.value)} autoFocus maxLength={100} onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }} /><Button variant="ghost" size="icon" title="Salvar nome" aria-label="Salvar nome" onClick={save} disabled={!draft.trim()}><Check /></Button><Button variant="ghost" size="icon" title="Cancelar edição" aria-label="Cancelar edição" onClick={() => setEditing(false)}><X /></Button></div> : <><h3 className="break-words font-semibold leading-6">{name}</h3><span className="text-xs text-muted-foreground">Candidato à eleição</span></>}
        </div>
        {!editing && <div className="flex shrink-0"><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title={`Editar ${name}`} aria-label={`Editar ${name}`} onClick={() => { setDraft(name); setEditing(true); }}><Ellipsis /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title={`Excluir ${name}`} aria-label={`Excluir ${name}`}><Trash2 /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir candidato?</AlertDialogTitle><AlertDialogDescription>Excluir {name} e seus {votes} votos? Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>}
      </div>
      <div className="candidate-counter"><div><span className="vote-number tabular-nums" aria-live="polite">{votes}</span><span className="ml-2 text-sm text-muted-foreground">{votes === 1 ? "voto" : "votos"}</span></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={onRemoveVote} disabled={votes === 0} title={`Remover voto de ${name}`} aria-label={`Remover voto de ${name}`}><Minus /></Button><Button size="icon" onClick={onAddVote} title={`Adicionar voto para ${name}`} aria-label={`Adicionar voto para ${name}`}><Plus /></Button></div></div>
    </article>
  );
};
