import { BookOpen } from "lucide-react";
import { normalizeName } from "@/lib/election";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BiblicalInfoDialogProps {
  positionName: string;
}

const biblicalInfo: Record<string, { title: string; verses: string; requirements: string[] }> = {
  "Diácono": {
    title: "Características do Diácono (1 Timóteo 3:8-13)",
    verses: "\"Os diáconos igualmente devem ser dignos, homens de palavra, não amigos de muito vinho nem de lucro desonesto. Devem apegar-se ao mistério da fé com a consciência limpa.\" - 1 Timóteo 3:8-9",
    requirements: [
      "Dignos e respeitáveis",
      "Homens de palavra (sinceros, não de duas línguas)",
      "Não inclinados a muito vinho",
      "Não cobiçosos de lucro desonesto",
      "Devem guardar o mistério da fé com consciência pura",
      "Primeiro sejam experimentados",
      "Maridos de uma só mulher",
      "Governem bem seus filhos e suas próprias casas",
    ],
  },
  "Presbítero": {
    title: "Características do Presbítero (1 Timóteo 3:1-7)",
    verses: "\"Se alguém deseja ser bispo, deseja uma nobre função. É necessário, pois, que o bispo seja irrepreensível, marido de uma só mulher, moderado, sensato, respeitável, hospitaleiro e apto para ensinar.\" - 1 Timóteo 3:1-2",
    requirements: [
      "Irrepreensível (acima de qualquer acusação)",
      "Marido de uma só mulher",
      "Temperante (sóbrio, moderado)",
      "Sóbrio (sensato, prudente)",
      "Respeitável (comportamento adequado)",
      "Hospitaleiro",
      "Apto para ensinar",
      "Não dado ao vinho",
      "Não violento, mas cordato (gentil)",
      "Não briguento",
      "Não avarento (não apegado ao dinheiro)",
      "Governe bem sua própria casa",
      "Filhos obedientes",
      "Não seja recém-convertido",
      "Tenha boa reputação com os de fora",
    ],
  },
};

export const BiblicalInfoDialog = ({ positionName }: BiblicalInfoDialogProps) => {
  const key = Object.keys(biblicalInfo).find(name => normalizeName(name) === normalizeName(positionName));
  const info = key ? biblicalInfo[key] : undefined;

  if (!info) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
          title="Ver características bíblicas"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Referência bíblica
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{info.title}</DialogTitle>
          <DialogDescription>Qualificações para o serviço na igreja.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm italic text-foreground leading-relaxed">
                {info.verses}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Requisitos e Qualificações:
              </h4>
              <ul className="space-y-2">
                {info.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
