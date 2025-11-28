import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="FileText" size={28} className="text-primary" />
            <h1 className="text-2xl font-semibold">DocFill</h1>
          </div>
          <Button onClick={() => window.location.href = '/documents'}>
            <Icon name="FolderOpen" size={18} className="mr-2" />
            Мои документы
          </Button>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Автоматизируйте заполнение документов
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Создавайте шаблоны с плейсхолдерами, заполняйте через удобные формы 
              и получайте готовые документы за секунды
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/documents'}>
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать работу
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="PlayCircle" size={20} className="mr-2" />
                Как это работает
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold text-center mb-12">Как это работает</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center animate-scale-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Upload" size={32} className="text-primary" />
                  </div>
                  <CardTitle>1. Загрузите шаблон</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Создайте шаблон документа с плейсхолдерами в формате {`{{field_name}}`}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center animate-scale-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Edit" size={32} className="text-primary" />
                  </div>
                  <CardTitle>2. Заполните поля</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Система автоматически определит поля и предложит удобную форму для заполнения
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center animate-scale-in">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Download" size={32} className="text-primary" />
                  </div>
                  <CardTitle>3. Скачайте результат</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Получите готовый документ для печати или дальнейшего использования
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-semibold text-center mb-12">Преимущества</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Экономия времени</h4>
                <p className="text-muted-foreground">
                  Забудьте о ручном копировании данных. Заполняйте документы в 10 раз быстрее
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Без ошибок</h4>
                <p className="text-muted-foreground">
                  Автоматическая проверка полей исключает опечатки и пропуски данных
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="RefreshCw" size={24} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Многократное использование</h4>
                <p className="text-muted-foreground">
                  Сохраните шаблон один раз и используйте неограниченное количество раз
                </p>
              </div>
            </div>

            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Briefcase" size={24} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Профессионально</h4>
                <p className="text-muted-foreground">
                  Деловой стиль и четкая структура для корпоративного использования
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16 animate-fade-in">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-semibold mb-4">Готовы начать?</h3>
            <p className="text-lg mb-8 opacity-90">
              Создайте первый шаблон и убедитесь, насколько это просто
            </p>
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/documents'}>
              <Icon name="ArrowRight" size={20} className="mr-2" />
              Перейти к документам
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 DocFill. Автоматизация заполнения документов</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
