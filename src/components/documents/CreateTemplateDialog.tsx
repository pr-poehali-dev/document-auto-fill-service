import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  templateContent: string;
  setTemplateContent: (content: string) => void;
  uploadMethod: 'text' | 'file';
  setUploadMethod: (method: 'text' | 'file') => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrepareTemplate: () => void;
}

const CreateTemplateDialog = ({
  isOpen,
  onOpenChange,
  templateName,
  setTemplateName,
  templateContent,
  setTemplateContent,
  uploadMethod,
  setUploadMethod,
  handleFileUpload,
  handlePrepareTemplate,
}: CreateTemplateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Icon name="Plus" size={20} />
          Создать шаблон
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создание нового шаблона</DialogTitle>
          <DialogDescription>
            Используйте формат {`{{placeholder}}`} для полей, которые нужно заполнить
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="template-name">Название шаблона</Label>
            <Input
              id="template-name"
              placeholder="Например: Договор аренды"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div className="space-y-3">
            <Label>Способ добавления</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <Icon name="Upload" size={18} className="mr-2" />
                Загрузить файл
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'text' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('text')}
                className="flex-1"
              >
                <Icon name="Type" size={18} className="mr-2" />
                Ввести текст
              </Button>
            </div>
          </div>

          {uploadMethod === 'file' ? (
            <div>
              <Label htmlFor="file-upload">Файл шаблона</Label>
              <div className="mt-1.5">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="FileUp" size={32} className="text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {templateContent ? 'Файл загружен' : 'Нажмите для загрузки файла'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      TXT, DOC, DOCX
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {templateContent && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Предварительный просмотр:</p>
                  <p className="text-xs font-mono line-clamp-3">{templateContent}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="template-content">Содержимое шаблона</Label>
              <Textarea
                id="template-content"
                placeholder={`Пример:\nДоговор заключен между {{company_name}} и {{client_name}} от {{date}}.`}
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                rows={10}
                className="mt-1.5 font-mono text-sm"
              />
            </div>
          )}

          <Button onClick={handlePrepareTemplate} className="w-full">
            Далее
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;
