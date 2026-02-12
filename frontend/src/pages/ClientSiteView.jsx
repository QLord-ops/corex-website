import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const blockTypes = [
  'hero',
  'pain',
  'how',
  'proof',
  'decision',
  'cta',
  'faq',
  'testimonials',
  'about',
];

function BlockRenderer({ block, index }) {
  const { type, props: p = {} } = block;

  const sectionClass = 'min-h-[60vh] flex items-center justify-center px-4 py-16 border-b border-border/30';

  switch (type) {
    case 'hero':
      return (
        <section className={`${sectionClass} bg-muted/20`}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              {p.title || 'Заголовок'}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{p.subtitle || ''}</p>
            {p.ctaText && (
              <Button asChild>
                <a href={p.ctaLink || '#'}>{p.ctaText}</a>
              </Button>
            )}
          </div>
        </section>
      );
    case 'pain':
      return (
        <section className={sectionClass}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {p.title || 'Проблемы'}
            </h2>
            <ul className="space-y-3">
              {(p.points || []).map((point, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {typeof point === 'string' ? point : point.text || point.title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case 'how':
      return (
        <section className={sectionClass}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-2">{p.title || 'Как мы работаем'}</h2>
            <p className="text-muted-foreground mb-8">{p.subtitle || ''}</p>
            <ul className="space-y-6">
              {(p.steps || []).map((step, i) => (
                <li key={i}>
                  <h3 className="font-medium text-foreground">
                    {typeof step === 'string' ? step : step.title || step.name}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case 'proof':
      return (
        <section className={sectionClass}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">{p.title || 'Результаты'}</h2>
            <p className="text-muted-foreground mb-8">{p.subtitle || ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(p.stats || []).map((stat, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50">
                  <div className="text-2xl font-semibold text-foreground">
                    {typeof stat === 'object' ? stat.value : stat}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {typeof stat === 'object' ? stat.label : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'cta':
      return (
        <section className={`${sectionClass} bg-muted/20`}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">{p.title || 'Связаться'}</h2>
            <p className="text-muted-foreground mb-6">{p.subtitle || ''}</p>
            {p.buttonText && (
              <Button asChild size="lg">
                <a href={p.buttonLink || '#'}>{p.buttonText}</a>
              </Button>
            )}
          </div>
        </section>
      );
    case 'faq':
      return (
        <section className={sectionClass}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-6">{p.title || 'Вопросы и ответы'}</h2>
            <ul className="space-y-4">
              {(p.items || []).map((item, i) => (
                <li key={i} className="border-b border-border/50 pb-4">
                  <h3 className="font-medium text-foreground">
                    {typeof item === 'string' ? item : item.question || item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {typeof item === 'object' ? item.answer || item.a : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case 'testimonials':
      return (
        <section className={sectionClass}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-6">{p.title || 'Отзывы'}</h2>
            <ul className="space-y-6">
              {(p.items || []).map((item, i) => (
                <li key={i} className="border-l-2 border-primary/50 pl-4">
                  <p className="text-muted-foreground italic">
                    {typeof item === 'string' ? item : item.text || item.quote}
                  </p>
                  {typeof item === 'object' && item.author && (
                    <p className="text-sm text-foreground mt-2">— {item.author}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case 'about':
      return (
        <section className={sectionClass}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-4">{p.title || 'О нас'}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{p.body || p.description || ''}</p>
          </div>
        </section>
      );
    case 'decision':
      return (
        <section className={sectionClass}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">{p.title || 'Готовы начать?'}</h2>
            <p className="text-muted-foreground">{p.subtitle || ''}</p>
          </div>
        </section>
      );
    default:
      return (
        <section className={sectionClass}>
          <div className="max-w-2xl mx-auto text-center text-muted-foreground">
            Блок «{type}» (редактирование в конструкторе)
          </div>
        </section>
      );
  }
}

export function ClientSiteView() {
  const { slug } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    apiGet(`/sites/by-slug/${slug}`)
      .then(setSite)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

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
        <p className="text-muted-foreground">
          {error || 'Сайт не найден или ещё не опубликован.'}
        </p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Link>
        </Button>
      </div>
    );
  }

  const blocks = site.blocks || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            COREX
          </Link>
          <span className="text-sm text-muted-foreground">{site.name}</span>
        </div>
      </header>

      <main>
        {blocks.length === 0 ? (
          <section className="min-h-[60vh] flex items-center justify-center px-4">
            <p className="text-muted-foreground text-center">
              На этом сайте пока нет блоков. Добавьте их в конструкторе.
            </p>
          </section>
        ) : (
          blocks.map((block, index) => (
            <BlockRenderer key={`${block.type}-${index}`} block={block} index={index} />
          ))
        )}
      </main>
    </div>
  );
}
