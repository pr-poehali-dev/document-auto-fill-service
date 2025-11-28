import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import CreateTemplateDialog from '@/components/documents/CreateTemplateDialog';
import PlaceholderLabelsDialog from '@/components/documents/PlaceholderLabelsDialog';
import FillDocumentDialog from '@/components/documents/FillDocumentDialog';
import DocumentCard from '@/components/documents/DocumentCard';

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
  const [exportFormat, setExportFormat] = useState<'txt' | 'pdf'>('pdf');
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

    if (exportFormat === 'pdf') {
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      const lines = doc.splitTextToSize(filledContent, maxWidth);
      let y = 20;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      doc.save(`${selectedDoc.name}_заполненный.pdf`);
    } else {
      const blob = new Blob([filledContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDoc.name}_заполненный.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setIsFillDialogOpen(false);
    toast({
      title: 'Готово',
      description: `Документ успешно сформирован в формате ${exportFormat.toUpperCase()}`,
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
          <CreateTemplateDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            templateName={templateName}
            setTemplateName={setTemplateName}
            templateContent={templateContent}
            setTemplateContent={setTemplateContent}
            uploadMethod={uploadMethod}
            setUploadMethod={setUploadMethod}
            handleFileUpload={handleFileUpload}
            handlePrepareTemplate={handlePrepareTemplate}
          />
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
              <DocumentCard
                key={doc.id}
                doc={doc}
                onFill={handleFillDocument}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}

        <FillDocumentDialog
          isOpen={isFillDialogOpen}
          onOpenChange={setIsFillDialogOpen}
          selectedDoc={selectedDoc}
          fillValues={fillValues}
          setFillValues={setFillValues}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          generateFilledDocument={generateFilledDocument}
        />

        <PlaceholderLabelsDialog
          isOpen={isLabelDialogOpen}
          onOpenChange={setIsLabelDialogOpen}
          tempPlaceholders={tempPlaceholders}
          placeholderLabels={placeholderLabels}
          setPlaceholderLabels={setPlaceholderLabels}
          handleUploadTemplate={handleUploadTemplate}
          setIsDialogOpen={setIsDialogOpen}
          setIsLabelDialogOpen={setIsLabelDialogOpen}
        />
      </main>
    </div>
  );
};

export default Documents;
