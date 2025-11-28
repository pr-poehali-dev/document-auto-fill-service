import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface DocumentTemplate {
  id: string;
  name: string;
  content: string;
  placeholders: string[];
  placeholderLabels: Record<string, string>;
  createdAt: Date;
}

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentTemplate[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentTemplate | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [fillValues, setFillValues] = useState<Record<string, string>>({});
  const [placeholderLabels, setPlaceholderLabels] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFillDialogOpen, setIsFillDialogOpen] = useState(false);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [tempPlaceholders, setTempPlaceholders] = useState<string[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text');
  const { toast } = useToast();

  const extractPlaceholders = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.match(regex);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
  };

  const getDefaultLabel = (placeholder: string): string => {
    const labels: Record<string, string> = {
      'name': 'Имя',
      'surname': 'Фамилия',
      'lastname': 'Отчество',
      'company': 'Компания',
      'company_name': 'Название компании',
      'client': 'Клиент',
      'client_name': 'Имя клиента',
      'date': 'Дата',
      'address': 'Адрес',
      'phone': 'Телефон',
      'email': 'Email',
      'sum': 'Сумма',
      'amount': 'Количество',
      'price': 'Цена',
      'position': 'Должность',
      'passport': 'Паспорт',
      'inn': 'ИНН',
    };
    return labels[placeholder.toLowerCase()] || placeholder.replace(/_/g, ' ');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTemplateContent(content);
      if (!templateName) {
        setTemplateName(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handlePrepareTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните название и содержимое шаблона',
        variant: 'destructive',
      });
      return;
    }

    const placeholders = extractPlaceholders(templateContent);
    
    if (placeholders.length === 0) {
      toast({
        title: 'Внимание',
        description: 'В шаблоне не найдены плейсхолдеры формата {{name}}',
        variant: 'destructive',
      });
      return;
    }

    setTempPlaceholders(placeholders);
    const defaultLabels: Record<string, string> = {};
    placeholders.forEach(p => {
      defaultLabels[p] = getDefaultLabel(p);
    });
    setPlaceholderLabels(defaultLabels);
    setIsDialogOpen(false);
    setIsLabelDialogOpen(true);
  };

  const handleUploadTemplate = () => {
    const newDoc: DocumentTemplate = {
      id: Date.now().toString(),
      name: templateName,
      content: templateContent,
      placeholders: tempPlaceholders,
      placeholderLabels: placeholderLabels,
      createdAt: new Date(),
    };

    setDocuments([...documents, newDoc]);
    setTemplateContent('');
    setTemplateName('');
    setPlaceholderLabels({});
    setTempPlaceholders([]);
    setIsLabelDialogOpen(false);
    
    toast({
      title: 'Успешно',
      description: `Шаблон создан. Найдено полей: ${tempPlaceholders.length}`,
    });
  };

  const handleFillDocument = (doc: DocumentTemplate) => {
    setSelectedDoc(doc);
    const initialValues: Record<string, string> = {};
    doc.placeholders.forEach(placeholder => {
      initialValues[placeholder] = '';
    });
    setFillValues(initialValues);
    setIsFillDialogOpen(true);
  };

  const generateFilledDocument = () => {
    if (!selectedDoc) return;

    let filledContent = selectedDoc.content;
    Object.entries(fillValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      filledContent = filledContent.replace(regex, value || `{{${key}}}`);
    });

    const blob = new Blob([filledContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc.name}_заполненный.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsFillDialogOpen(false);
    toast({
      title: 'Готово',
      description: 'Документ успешно сформирован и загружен',
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: 'Удалено',
      description: 'Шаблон успешно удалён',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="FileText" size={28} className="text-primary" />
            <h1 className="text-2xl font-semibold">DocFill</h1>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="Home" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Мои документы</h2>
            <p className="text-muted-foreground">
              Управляйте шаблонами и заполняйте документы
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        </div>

        {documents.length === 0 ? (
          <Card className="border-dashed animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Icon name="FileSearch" size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Нет шаблонов</h3>
              <p className="text-muted-foreground text-center mb-6">
                Создайте первый шаблон документа для начала работы
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Icon name="Plus" size={18} className="mr-2" />
                Создать первый шаблон
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow animate-scale-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon name="FileText" size={24} className="text-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
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
                      onClick={() => handleFillDocument(doc)}
                      className="w-full"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Заполнить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFillDialogOpen} onOpenChange={setIsFillDialogOpen}>
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
              <div className="flex gap-3 pt-4">
                <Button onClick={generateFilledDocument} className="flex-1">
                  <Icon name="Download" size={18} className="mr-2" />
                  Скачать документ
                </Button>
                <Button variant="outline" onClick={() => setIsFillDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
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
      </main>
    </div>
  );
};

export default Documents;