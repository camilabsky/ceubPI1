import { Home, ListTodo, Gift, User, Sprout, Compass } from 'lucide-react';

type Page = 'home' | 'explore' | 'tasks' | 'rewards' | 'profile';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

export default function Sidebar({ currentPage, onNavigate, isAdmin }: SidebarProps) {
  const items: { page: Page; label: string; icon: typeof Home }[] = [
    { page: 'home', label: 'Início', icon: Home },
    ...(!isAdmin ? [{ page: 'explore' as Page, label: 'Explorar', icon: Compass }] : []),
    { page: 'tasks', label: isAdmin ? 'Tarefas' : 'Minhas tarefas', icon: ListTodo },
    { page: 'rewards', label: 'Recompensas', icon: Gift },
    { page: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-white border-r border-gray-200 px-4 py-6 z-40">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <Sprout className="size-6 text-[#00a63e]" />
          <span className="text-[18px] font-bold tracking-tight text-neutral-950">Couve</span>
        </div>
        <p className="ml-8 mt-0.5 text-[11px] text-[#7a867d]">Comunidade &amp; cultivo</p>
      </div>

      {isAdmin && (
        <div className="bg-[#00a63e] text-white px-3 py-2 rounded-lg text-[12px] text-center mb-4">
          Modo admin disponível
        </div>
      )}

      <nav className="flex flex-col gap-1">
        {items.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
              currentPage === page
                ? 'bg-green-50 text-[#00a63e] font-medium'
                : 'text-[#4a5565] hover:bg-gray-50'
            }`}
          >
            <Icon
              className={`size-5 ${
                currentPage === page ? 'fill-[#00a63e] stroke-[#00a63e]' : 'stroke-[#4a5565]'
              }`}
            />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
