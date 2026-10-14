import { Candidate } from "@/types/election";
import { VoteCard } from "@/components/VoteCard";
interface VoteListProps { candidates: Candidate[]; onAddVote: (id: string) => void; onRemoveVote: (id: string) => void; onDelete: (id: string) => void; onEdit: (id: string, name: string) => void; }
export const VoteList = ({ candidates, onAddVote, onRemoveVote, onDelete, onEdit }: VoteListProps) => <div className="space-y-3">{candidates.map(c => <VoteCard key={c.id} name={c.name} votes={c.votes} layout="list" onAddVote={() => onAddVote(c.id)} onRemoveVote={() => onRemoveVote(c.id)} onDelete={() => onDelete(c.id)} onEdit={name => onEdit(c.id, name)} />)}</div>;
