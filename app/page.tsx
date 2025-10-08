"use client";

import { SkillmapEditor } from "@/components/skillmap-editor";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <header style={{
        background: 'var(--bg-primary)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em'
            }}>
              Skillmap Editor
            </h1>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-1)'
            }}>
              Upload, edit, and download skillmap JSON files
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-6">
        <SkillmapEditor />
      </main>
    </div>
  );
}
