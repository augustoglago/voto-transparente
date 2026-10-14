import type { Candidate } from "@/types/election";

export const normalizeName = (name: string) => name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function rankCandidates(candidates: Candidate[]) {
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  return sorted.map((candidate, index) => ({
    ...candidate,
    rank: candidate.votes > 0 ? sorted.findIndex((item) => item.votes === candidate.votes) + 1 : null,
    tied: candidate.votes > 0 && sorted.some((item, otherIndex) => otherIndex !== index && item.votes === candidate.votes),
  }));
}