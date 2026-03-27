'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  categories: Category[];
}

export function CategorySidebar({ categories }: CategorySidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Categorías" className="w-full">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 px-2">
        Categorías
      </h2>
      <ul className="space-y-0.5">
        {categories.map((cat) => {
          const href = `/categoria/${cat.slug}`;
          const isActive = pathname === href;
          return (
            <li key={cat.id}>
              <Link
                href={href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors',
                  isActive
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-brand-600',
                )}
              >
                <span className="truncate">{cat.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
