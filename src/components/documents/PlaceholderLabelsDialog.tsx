import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PlaceholderLabelsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempPlaceholders: string[];
  placeholderLabels: Record<string, string>;
  setPlaceholderLabels: (labels: Record<string, string>) => void;
  handleUploadTemplate: () => void;
  setIsDialogOpen: (open: boolean) => void;
  setIsLabelDialogOpen: (open: boolean) => void;
}

const PlaceholderLabelsDialog = ({
  isOpen,
  onOpenChange,
  tempPlaceholders,
  placeholderLabels,
  setPlaceholderLabels,
  handleUploadTemplate,
  setIsDialogOpen,
  setIsLabelDialogOpen,
}: PlaceholderLabelsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройка наименований полей</DialogTitle>
          <DialogDescription>
            Укажите понятные названия для каждого плейсхолдера
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {tempPlaceholders.map((placeholder) => (
            <div key={placeholder} className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Label className="text-muted-foreground text-sm font-mono">
                  {`{{${placeholder}}}`}
                </Label>
              </div>
              <div>
                <Input
                  value={placeholderLabels[placeholder] || ''}
                  onChange={(e) =>
                    setPlaceholderLabels({
                      ...placeholderLabels,
                      [placeholder]: e.target.value,
                    })
                  }
                  placeholder="Наименование"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleUploadTemplate} className="flex-1">
              Создать шаблон
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsLabelDialogOpen(false);
                setIsDialogOpen(true);
              }}
            >
              Назад
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceholderLabelsDialog;
