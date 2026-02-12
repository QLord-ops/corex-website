import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiGet, apiPost } from '@/lib/api';
import { Plus, ExternalLink, LayoutDashboard } from 'lucide-react';

export function BuilderDashboard() {
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);

  useEffect(() => {
    Promise.all([apiGet('/clients'), apiGet('/sites')])
      .then(([c, s]) => {
        setClients(c);
        setSites(s);
        if (c.length && !selectedClientId) setSelectedClientId(c[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredSites = selectedClientId
    ? sites.filter((s) => s.client_id === selectedClientId)
    : sites;

  const handleCreate = () => {
    if (!selectedClientId || !newName.trim() || !newSlug.trim()) return;
    setCreating(true);
    setError(null);
    apiPost('/sites', {
      client_id: selectedClientId,
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      blocks: [],
    })
      .then((site) => {
        setSites((prev) => [site, ...prev]);
        setCreateOpen(false);
        setNewName('');
        setNewSlug('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setCreating(false));
  };

  const handleCreateClient = () => {
    if (!newClientName.trim()) return;
    setCreatingClient(true);
    setError(null);
    apiPost('/clients', { name: newClientName.trim(), email: newClientEmail.trim() || undefined })
      .then((client) => {
        setClients((prev) => [...prev, client]);
        setSelectedClientId(client.id);
        setClientDialogOpen(false);
        setNewClientName('');
        setNewClientEmail('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setCreatingClient(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-medium text-foreground hover:opacity-80">
            COREX DIGITAL
          </Link>
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Конструктор сайтов
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Мои сайты</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Создавайте лендинги из блоков и публикуйте по ссылке.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {clients.length > 0 && (
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Клиент" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Добавить клиента</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новый клиент</DialogTitle>
                  <DialogDescription>Название компании или имя клиента.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="clientName">Название</Label>
                    <Input
                      id="clientName"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="Компания или имя"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email (необязательно)</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setClientDialogOpen(false)}>Отмена</Button>
                  <Button onClick={handleCreateClient} disabled={creatingClient || !newClientName.trim()}>
                    {creatingClient ? 'Создание…' : 'Создать'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button disabled={!selectedClientId}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать сайт
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новый сайт</DialogTitle>
                  <DialogDescription>
                    Задайте название и уникальный адрес (slug) для страницы.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Название</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Лендинг продукта X"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Адрес (slug)</Label>
                    <Input
                      id="slug"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="product-x"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Сайт будет доступен по адресу: /s/{newSlug || '…'}
                    </p>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleCreate} disabled={creating || !newName.trim() || !newSlug.trim()}>
                    {creating ? 'Создание…' : 'Создать'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {clients.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">Нет клиентов. Добавьте первого клиента.</p>
              <Button onClick={() => setClientDialogOpen(true)}>Добавить клиента</Button>
            </CardContent>
          </Card>
        )}

        {clients.length > 0 && filteredSites.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              У этого клиента пока нет сайтов. Нажмите «Создать сайт».
            </CardContent>
          </Card>
        )}

        {filteredSites.length > 0 && (
          <ul className="space-y-3">
            {filteredSites.map((site) => (
              <Card key={site.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">{site.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {site.published_at ? (
                      <a
                        href={`/s/${site.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">Черновик</span>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/builder/sites/${site.id}`}>Редактировать</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    /s/{site.slug} · Блоков: {site.blocks?.length ?? 0}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
