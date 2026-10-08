'use client';

import { useRouter } from 'next/navigation';

export function ProductLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  
  return (
    <div 
      onClick={() => router.push(href)} 
      className={`cursor-pointer ${className || ''}`}
    >
      {children}
    </div>
  );
}
