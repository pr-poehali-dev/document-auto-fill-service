import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface DocumentTemplate {
  id: string;
  name: string;
  content: string;
  placeholders: string[];
  placeholderLabels: Record<string, string>;
  createdAt: Date;
}

interface FillDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoc: DocumentTemplate | null;
  fillValues: Record<string, string>;
  setFillValues: (values: Record<string, string>) => void;
  exportFormat: 'txt' | 'pdf';
  setExportFormat: (format: 'txt' | 'pdf') => void;
  generateFilledDocument: () => void;
}

const FillDocumentDialog = ({
  isOpen,
  onOpenChange,
  selectedDoc,
  fillValues,
  setFillValues,
  exportFormat,
  setExportFormat,
  generateFilledDocument,
}: FillDocumentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Заполнение: {selectedDoc?.name}</DialogTitle>
          <DialogDescription>
            Заполните поля для генерации документа
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {selectedDoc?.placeholders.map((placeholder) => (
            <div key={placeholder}>
              <Label htmlFor={placeholder}>
                {selectedDoc.placeholderLabels[placeholder] || placeholder}
              </Label>
              <Input
                id={placeholder}
                value={fillValues[placeholder] || ''}
                onChange={(e) =>
                  setFillValues({ ...fillValues, [placeholder]: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <Label htmlFor="export-format">Формат экспорта</Label>
            <Select value={exportFormat} onValueChange={(value: 'txt' | 'pdf') => setExportFormat(value)}>
              <SelectTrigger id="export-format" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    <span>PDF документ</span>
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <Icon name="File" size={16} />
                    <span>Текстовый файл</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={generateFilledDocument} className="flex-1">
              <Icon name="Download" size={18} className="mr-2" />
              Скачать {exportFormat.toUpperCase()}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FillDocumentDialog;
