import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DocumentTemplate {
  id: string;
  name: string;
  content: string;
  placeholders: string[];
  placeholderLabels: Record<string, string>;
  createdAt: Date;
}

interface DocumentCardProps {
  doc: DocumentTemplate;
  onFill: (doc: DocumentTemplate) => void;
  onDelete: (id: string) => void;
}

const DocumentCard = ({ doc, onFill, onDelete }: DocumentCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow animate-scale-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Icon name="FileText" size={24} className="text-primary" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(doc.id)}
          >
            <Icon name="Trash2" size={16} className="text-destructive" />
          </Button>
        </div>
        <CardTitle className="mt-3">{doc.name}</CardTitle>
        <CardDescription>
          {doc.placeholders.length} {doc.placeholders.length === 1 ? 'поле' : 'полей'} для заполнения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {doc.placeholders.slice(0, 3).map((placeholder) => (
              <span
                key={placeholder}
                className="text-xs bg-muted px-2 py-1 rounded-md"
              >
                {doc.placeholderLabels[placeholder] || placeholder}
              </span>
            ))}
            {doc.placeholders.length > 3 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                +{doc.placeholders.length - 3}
              </span>
            )}
          </div>
          <Button
            onClick={() => onFill(doc)}
            className="w-full"
          >
            <Icon name="Edit" size={16} className="mr-2" />
            Заполнить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
