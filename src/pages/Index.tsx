import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Stats {
  hunger: number;
  thirst: number;
  health: number;
  fatigue: number;
}

interface MapLocation {
  id: string;
  name: string;
  type: 'city' | 'military' | 'hospital' | 'shelter';
  x: number;
  y: number;
}

interface CraftItem {
  id: string;
  name: string;
  description: string;
  resources: { name: string; amount: number }[];
  icon: string;
}

const Index = () => {
  const [stats, setStats] = useState<Stats>({
    hunger: 75,
    thirst: 60,
    health: 85,
    fatigue: 40
  });

  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });

  const mapLocations: MapLocation[] = [
    { id: '1', name: 'Черногорск', type: 'city', x: 30, y: 40 },
    { id: '2', name: 'Военная база', type: 'military', x: 70, y: 20 },
    { id: '3', name: 'Больница', type: 'hospital', x: 45, y: 60 },
    { id: '4', name: 'Укрытие', type: 'shelter', x: 60, y: 80 }
  ];

  const craftItems: CraftItem[] = [
    {
      id: '1',
      name: 'Деревянное укрытие',
      description: 'Базовая защита от непогоды',
      resources: [
        { name: 'Дерево', amount: 10 },
        { name: 'Веревка', amount: 5 }
      ],
      icon: 'Home'
    },
    {
      id: '2',
      name: 'Костер',
      description: 'Источник тепла и света',
      resources: [
        { name: 'Дерево', amount: 5 },
        { name: 'Камни', amount: 8 }
      ],
      icon: 'Flame'
    },
    {
      id: '3',
      name: 'Укрепленные стены',
      description: 'Прочная защита периметра',
      resources: [
        { name: 'Металл', amount: 15 },
        { name: 'Дерево', amount: 20 }
      ],
      icon: 'Shield'
    },
    {
      id: '4',
      name: 'Хранилище',
      description: 'Место для припасов',
      resources: [
        { name: 'Дерево', amount: 12 },
        { name: 'Гвозди', amount: 10 }
      ],
      icon: 'Package'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        hunger: Math.max(0, prev.hunger - 0.5),
        thirst: Math.max(0, prev.thirst - 0.7),
        health: prev.health > 30 ? prev.health : Math.max(0, prev.health - 0.2),
        fatigue: Math.min(100, prev.fatigue + 0.3)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatColor = (value: number) => {
    if (value > 60) return 'bg-primary';
    if (value > 30) return 'bg-accent';
    return 'bg-destructive';
  };

  const getStatIcon = (stat: keyof Stats) => {
    const icons = {
      hunger: 'Utensils',
      thirst: 'Droplet',
      health: 'Heart',
      fatigue: 'Moon'
    };
    return icons[stat];
  };

  const consumeItem = (stat: keyof Stats) => {
    setStats(prev => ({
      ...prev,
      [stat]: Math.min(100, prev[stat] + 25)
    }));
    toast.success('Предмет использован');
  };

  const craftItem = (item: CraftItem) => {
    toast.success(`${item.name} создан!`);
  };

  const getLocationIcon = (type: string) => {
    const icons = {
      city: 'Building2',
      military: 'Crosshair',
      hospital: 'Cross',
      shelter: 'Tent'
    };
    return icons[type as keyof typeof icons] || 'MapPin';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wider text-foreground">
            DAYZ SURVIVAL
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Выживание в зоне заражения
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Icon name="Activity" size={24} className="text-destructive" />
              СТАТУС
            </h2>
            <div className="space-y-6">
              {(Object.keys(stats) as Array<keyof Stats>).map((stat) => (
                <div key={stat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={getStatIcon(stat)} 
                        size={20} 
                        className={stats[stat] < 30 ? 'text-destructive' : 'text-muted-foreground'}
                      />
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {stat === 'hunger' && 'Голод'}
                        {stat === 'thirst' && 'Жажда'}
                        {stat === 'health' && 'Здоровье'}
                        {stat === 'fatigue' && 'Усталость'}
                      </span>
                    </div>
                    <span className="text-xs font-mono">{Math.round(stats[stat])}%</span>
                  </div>
                  <Progress 
                    value={stats[stat]} 
                    className="h-3"
                    indicatorClassName={getStatColor(stats[stat])}
                  />
                  {stats[stat] < 50 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => consumeItem(stat)}
                    >
                      <Icon name="Plus" size={14} className="mr-1" />
                      Восстановить
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card border-border lg:col-span-2">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Icon name="Map" size={18} />
                  Карта
                </TabsTrigger>
                <TabsTrigger value="craft" className="flex items-center gap-2">
                  <Icon name="Hammer" size={18} />
                  Крафт
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2">
                  <Icon name="Info" size={18} />
                  О проекте
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  КАРТА ЛОКАЦИЙ
                </h2>
                <div className="relative aspect-video bg-secondary rounded-lg border-2 border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-muted/50">
                    <div className="absolute inset-0 opacity-10" 
                         style={{
                           backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)'
                         }}>
                    </div>
                  </div>

                  {mapLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon name={getLocationIcon(loc.type)} size={20} className="text-accent" />
                        </div>
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-card border border-border rounded px-3 py-1 text-xs whitespace-nowrap">
                            {loc.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
                  >
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-ping"></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="craft" className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="Wrench" size={24} className="text-accent" />
                  СТРОИТЕЛЬСТВО
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {craftItems.map((item) => (
                    <Card key={item.id} className="p-4 bg-secondary border-border hover:border-accent transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon name={item.icon} size={24} className="text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Ресурсы:</p>
                          {item.resources.map((res, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span>{res.name}</span>
                              <span className="font-mono text-accent">{res.amount}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => craftItem(item)}
                        >
                          <Icon name="Hammer" size={16} className="mr-2" />
                          Построить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Icon name="BookOpen" size={24} className="text-primary" />
                  О ПРОЕКТЕ
                </h2>
                <div className="space-y-6">
                  <Card className="p-6 bg-secondary border-border">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Icon name="Target" size={20} className="text-accent" />
                      Цель игры
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      DayZ Survival — это симулятор выживания в постапокалиптическом мире. 
                      Ваша задача — выжить как можно дольше, следя за жизненными показателями, 
                      собирая ресурсы и строя укрытия в зараженной зоне.
                    </p>
                  </Card>

                  <Card className="p-6 bg-secondary border-border">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Icon name="Gamepad2" size={20} className="text-accent" />
                      Игровые механики
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon name="Activity" size={20} className="text-destructive" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Система выживания</h4>
                          <p className="text-sm text-muted-foreground">
                            Следите за четырьмя показателями: голод, жажда, здоровье и усталость. 
                            Показатели автоматически снижаются со временем — вовремя используйте предметы для восстановления.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon name="Map" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Исследование территории</h4>
                          <p className="text-sm text-muted-foreground">
                            На карте отмечены ключевые локации: города для поиска припасов, 
                            военные базы с оружием, больницы для медикаментов и безопасные укрытия.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon name="Hammer" size={20} className="text-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Крафт и строительство</h4>
                          <p className="text-sm text-muted-foreground">
                            Собирайте ресурсы и создавайте полезные постройки: укрытия защитят от непогоды, 
                            костер согреет ночью, а укрепленные стены обезопасят ваш лагерь.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-secondary border-border">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Icon name="Lightbulb" size={20} className="text-accent" />
                      Советы по выживанию
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Не допускайте падения показателей ниже 30% — это критически опасно</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Жажда падает быстрее голода — всегда имейте запас воды</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Постройте укрытие в первую очередь — оно защитит от угроз</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Исследуйте разные локации для сбора различных типов ресурсов</span>
                      </li>
                    </ul>
                  </Card>

                  <div className="text-center pt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Skull" size={16} className="text-destructive" />
                      <span>Выживание — ваш единственный приоритет</span>
                      <Icon name="Skull" size={16} className="text-destructive" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Card className="p-6 bg-card/50 border-border">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Navigation" size={16} />
              <span>Координаты: {playerPos.x}, {playerPos.y}</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              <span>Режим: Одиночная игра</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>Время в игре: 14:32</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;