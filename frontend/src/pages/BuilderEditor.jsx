import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Eye, Send } from 'lucide-react';

const BLOCK_TEMPLATES = {
  hero: { type: 'hero', props: { title: 'Заголовок', subtitle: 'Подзаголовок', ctaText: 'Действие', ctaLink: '#' } },
  pain: { type: 'pain', props: { title: 'Проблемы', points: ['Пункт 1', 'Пункт 2'] } },
  how: { type: 'how', props: { title: 'Как мы работаем', subtitle: '', steps: [{ title: 'Шаг 1', description: 'Описание' }] } },
  proof: { type: 'proof', props: { title: 'Результаты', subtitle: '', stats: [{ value: '+0%', label: 'метрика' }] } },
  decision: { type: 'decision', props: { title: 'Готовы начать?', subtitle: '' } },
  cta: { type: 'cta', props: { title: 'Связаться', subtitle: '', buttonText: 'Написать', buttonLink: '#' } },
  faq: { type: 'faq', props: { title: 'Вопросы и ответы', items: [{ question: 'Вопрос?', answer: 'Ответ.' }] } },
  testimonials: { type: 'testimonials', props: { title: 'Отзывы', items: [{ text: 'Текст отзыва', author: 'Имя' }] } },
  about: { type: 'about', props: { title: 'О нас', body: 'Текст о компании.' } },
};

export function BuilderEditor() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadSite = () => {
    if (!siteId) return;
    apiGet(`/sites/${siteId}`)
      .then(setSite)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSite();
  }, [siteId]);

  const addBlock = (type) => {
    const template = BLOCK_TEMPLATES[type] || { type, props: {} };
    const blocks = [...(site.blocks || []), template];
    setSaving(true);
    apiPut(`/sites/${siteId}`, { blocks })
      .then(setSite)
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  const removeBlock = (index) => {
    const blocks = (site.blocks || []).filter((_, i) => i !== index);
    setSaving(true);
    apiPut(`/sites/${siteId}`, { blocks })
      .then(setSite)
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  const publish = () => {
    const published_at = new Date().toISOString();
    setSaving(true);
    apiPut(`/sites/${siteId}`, { published_at })
      .then(setSite)
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">{error || 'Сайт не найден.'}</p>
        <Button asChild variant="outline">
          <Link to="/builder">В дашборд</Link>
        </Button>
      </div>
    );
  }

  const blocks = site.blocks || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/builder">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Назад
              </Link>
            </Button>
            <span className="font-medium text-foreground">{site.name}</span>
            <span className="text-sm text-muted-foreground">/s/{site.slug}</span>
          </div>
          <div className="flex items-center gap-2">
            {site.published_at ? (
              <Button asChild size="sm" variant="outline">
                <a href={`/s/${site.slug}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-1" />
                  Открыть сайт
                </a>
              </Button>
            ) : (
              <Button size="sm" onClick={publish} disabled={saving}>
                <Send className="w-4 h-4 mr-1" />
                Опубликовать
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Добавить блок</CardTitle>
                <CardContent className="p-0 pt-2">
                  <Select onValueChange={addBlock} disabled={saving}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип блока" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(BLOCK_TEMPLATES).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </CardHeader>
            </Card>
            <p className="text-xs text-muted-foreground">
              Редактирование полей блоков (тексты, ссылки) можно добавить в следующей версии — пока блоки добавляются с шаблонным содержимым.
            </p>
          </aside>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Блоки на странице ({blocks.length})</CardTitle>
                <CardDescription>Порядок и удаление — в следующих итерациях.</CardDescription>
              </CardHeader>
              <CardContent>
                {blocks.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Добавьте первый блок из списка слева.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {blocks.map((block, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-md border border-border/50 bg-muted/20"
                      >
                        <span className="text-sm font-medium">{block.type}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeBlock(index)}
                          disabled={saving}
                        >
                          Удалить
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
