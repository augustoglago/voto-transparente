import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Position } from "@/types/election";
import { rankCandidates } from "@/lib/election";
export function exportResults(positions: Position[]) {
  const doc = new jsPDF();
  const generated = new Date();
  doc.setFont("helvetica", "bold"); doc.setFontSize(21);
  doc.text("Assembleia | Resultados", 20, 23);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text("Apuração de votos para eleição de cargos", 20, 32);
  let y = 48;
  for (const position of positions) {
    const title = doc.splitTextToSize(position.name, 170) as string[];
    const titleHeight = title.length * 7;
    if (y + titleHeight + 35 > 267) { doc.addPage(); y = 22; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(title, 20, y);
    y += titleHeight + 3;
    const total = position.candidates.reduce((sum, c) => sum + c.votes, 0);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(`Total: ${total} votos | ${position.candidates.length} candidatos`, 20, y);
    y += 8;
    if (!position.candidates.length) { doc.text("Nenhum candidato cadastrado.", 20, y); y += 20; continue; }
    autoTable(doc, { startY: y, head: [["Posição", "Candidato", "Votos", "Percentual", "Situação"]], body: rankCandidates(position.candidates).map(c => [c.rank ? `${c.rank}º` : "—", c.name, c.votes, total ? `${(c.votes / total * 100).toFixed(1)}%` : "0%", c.tied ? "Empate" : "—"]), theme: "striped", headStyles: { fillColor: [178, 78, 26] }, styles: { font: "helvetica", fontSize: 10, cellPadding: 3 }, margin: { left: 20, right: 20, top: 22, bottom: 23 } });
    const tableDoc = doc as jsPDF & { lastAutoTable?: { finalY: number } };
    y = (tableDoc.lastAutoTable?.finalY ?? y) + 18;
  }
  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) { doc.setPage(page); doc.setFontSize(8); doc.text(`Gerado em ${generated.toLocaleString("pt-BR")} · ${page}/${count}`, 20, 286); }
  doc.save(`assembleia-resultados-${generated.toISOString().slice(0, 10)}.pdf`);
}
