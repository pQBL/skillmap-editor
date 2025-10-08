"use client";

import { useState } from "react";
import type { Skillmap } from "@/lib/schema";

interface ModuleSidebarProps {
  skillmap: Skillmap;
  selectedIndex: number;
  onSelectModule: (index: number) => void;
  onReorder: (newOrder: number[]) => void;
  onAddModule: () => void;
  onRemoveModule: (index: number) => void;
}

export function ModuleSidebar({
  skillmap,
  selectedIndex,
  onSelectModule,
  onReorder,
  onAddModule,
  onRemoveModule,
}: ModuleSidebarProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newOrder = Array.from({ length: skillmap.modules.length }, (_, i) => i);
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dragOverIndex, 0, removed);
      onReorder(newOrder);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleRemoveClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemoveModule(index);
  };

  return (
    <div style={{
      flex: '1',
      minWidth: 0,
      maxWidth: '25%',
      background: 'var(--bg-primary)',
      borderRight: 'var(--border-width) solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        padding: 'var(--space-4)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        <h3 style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Modules
        </h3>
        <button
          onClick={onAddModule}
          className="btn btn-primary"
          style={{
            width: '100%',
            fontSize: 'var(--text-sm)'
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Module
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-2)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {skillmap.modules.map((module, index) => {
            const isSelected = selectedIndex === index;
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
                onClick={() => onSelectModule(index)}
                className="group"
                style={{
                  position: 'relative',
                  padding: 'var(--space-3)',
                  cursor: 'move',
                  transition: 'all var(--transition-fast)',
                  background: isSelected ? 'var(--color-primary-500)' : 'transparent',
                  color: isSelected ? 'var(--text-on-primary)' : 'var(--text-primary)',
                  borderRadius: 'var(--radius-base)',
                  opacity: isDragged ? 0.5 : 1,
                  borderTop: isDragOver ? '3px solid var(--color-primary-500)' : '3px solid transparent',
                  marginTop: isDragOver ? 'var(--space-2)' : '0'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  minWidth: 0
                }}>
                  <svg
                    style={{
                      width: '14px',
                      height: '14px',
                      flexShrink: 0,
                      opacity: 0.4
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-bold)',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px var(--space-2)',
                    background: isSelected
                      ? 'var(--color-primary-600)'
                      : 'var(--color-neutral-200)',
                    color: isSelected
                      ? 'var(--text-on-primary)'
                      : 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0
                  }}>
                    {module.title || `Module ${index + 1}`}
                  </span>
                  {skillmap.modules.length > 1 && (
                    <button
                      onClick={(e) => handleRemoveClick(e, index)}
                      title="Remove module"
                      className="group-hover:opacity-100"
                      style={{
                        opacity: 0,
                        padding: 'var(--space-1)',
                        background: isSelected ? 'var(--color-primary-600)' : 'var(--color-error-bg)',
                        color: isSelected ? 'var(--text-on-primary)' : 'var(--color-error)',
                        border: 'none',
                        borderRadius: 'var(--radius-base)',
                        cursor: 'pointer',
                        transition: 'opacity var(--transition-fast)',
                        flexShrink: 0
                      }}
                    >
                      <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
