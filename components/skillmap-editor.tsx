"use client";

import { useState, useEffect } from "react";
import { skillmapSchema, type Skillmap } from "@/lib/schema";
import { FileUpload } from "@/components/file-upload";
import { SkillmapForm } from "@/components/skillmap-form";
import { ModuleSidebar } from "@/components/module-sidebar";
import { SkillmapMetadata } from "@/components/skillmap-metadata";

const LOCALSTORAGE_KEY = "skillmap-editor-data";

function addTimestampSuffix(filename: string): string {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .split('Z')[0];

  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return `${filename}_${timestamp}`;
  }

  const name = filename.substring(0, lastDot);
  const ext = filename.substring(lastDot);
  return `${name}_${timestamp}${ext}`;
}

export function SkillmapEditor() {
  const [skillmap, setSkillmap] = useState<Skillmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [isEditingFileName, setIsEditingFileName] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = skillmapSchema.parse(parsed.data);
        setSkillmap(validated);
        setFileName(parsed.fileName || "skillmap.json");
      }
    } catch (err) {
      console.error("Failed to load from localStorage:", err);
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (skillmap) {
      try {
        localStorage.setItem(
          LOCALSTORAGE_KEY,
          JSON.stringify({ data: skillmap, fileName })
        );
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }
    }
  }, [skillmap, fileName]);

  const handleFileLoad = (file: File, content: string) => {
    setError(null);
    try {
      const json = JSON.parse(content);
      const validated = skillmapSchema.parse(json);
      setSkillmap(validated);
      setFileName(addTimestampSuffix(file.name));
      setSelectedModuleIndex(0);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Validation error: ${err.message}`);
      } else {
        setError("Failed to parse or validate JSON file");
      }
    }
  };

  const handleDownload = () => {
    if (!skillmap) return;

    const json = JSON.stringify(skillmap, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "skillmap.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the current skillmap?")) {
      setSkillmap(null);
      setFileName("");
      setError(null);
      setSelectedModuleIndex(0);
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  };

  const handleReorderModules = (newOrder: number[]) => {
    if (!skillmap) return;
    const reordered = newOrder.map((i) => skillmap.modules[i]);
    setSkillmap({ ...skillmap, modules: reordered });
    setSelectedModuleIndex(0);
  };

  const handleAddModule = () => {
    if (!skillmap) return;
    setSkillmap({
      ...skillmap,
      modules: [
        ...skillmap.modules,
        {
          title: "New Module",
          objectives: [],
        },
      ],
    });
    setSelectedModuleIndex(skillmap.modules.length);
  };

  const handleRemoveModule = (index: number) => {
    if (!skillmap) return;
    if (skillmap.modules.length <= 1) {
      alert("Cannot remove the last module");
      return;
    }
    if (confirm("Are you sure you want to remove this module?")) {
      setSkillmap({
        ...skillmap,
        modules: skillmap.modules.filter((_, i) => i !== index),
      });
      setSelectedModuleIndex(Math.max(0, Math.min(index, skillmap.modules.length - 2)));
    }
  };

  const updateMetadata = (title: string, description: string) => {
    if (!skillmap) return;
    setSkillmap({ ...skillmap, title, description });
  };

  if (!skillmap) {
    return (
      <div>
        <FileUpload onFileLoad={handleFileLoad} />
        {error && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-error-bg)',
            border: 'var(--border-width) solid var(--color-error)',
            borderRadius: 'var(--radius-base)'
          }}>
            <p style={{ color: 'var(--color-error)', fontWeight: 'var(--font-semibold)' }}>Error</p>
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Top Bar - File Info and Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-6)',
        background: 'var(--bg-primary)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
          <label style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'var(--font-medium)',
            whiteSpace: 'nowrap'
          }}>
            File:
          </label>
          {isEditingFileName ? (
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={() => setIsEditingFileName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingFileName(false);
                if (e.key === 'Escape') {
                  setIsEditingFileName(false);
                }
              }}
              autoFocus
              className="input"
              style={{
                flex: 1,
                maxWidth: '400px',
                fontSize: 'var(--text-sm)',
                padding: 'var(--space-1) var(--space-2)'
              }}
            />
          ) : (
            <button
              onClick={() => setIsEditingFileName(true)}
              style={{
                fontWeight: 'var(--font-semibold)',
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-base)',
                transition: 'background var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Click to edit filename"
            >
              {fileName}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Clear
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-primary"
          >
            Download JSON
          </button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Module Tabs (1/4) */}
        <ModuleSidebar
          skillmap={skillmap}
          selectedIndex={selectedModuleIndex}
          onSelectModule={setSelectedModuleIndex}
          onReorder={handleReorderModules}
          onAddModule={handleAddModule}
          onRemoveModule={handleRemoveModule}
        />

        {/* Middle Column - Module Editor (2/4) */}
        <div style={{
          flex: '2',
          minWidth: 0,
          maxWidth: '50%',
          overflowY: 'auto',
          borderRight: 'var(--border-width) solid var(--border-primary)'
        }}>
          <SkillmapForm
            skillmap={skillmap}
            onChange={setSkillmap}
            selectedModuleIndex={selectedModuleIndex}
          />
        </div>

        {/* Right Column - Metadata (1/4) */}
        <div style={{
          flex: '1',
          minWidth: 0,
          maxWidth: '25%',
          overflowY: 'auto',
          background: 'var(--bg-primary)'
        }}>
          <SkillmapMetadata
            title={skillmap.title}
            description={skillmap.description}
            onChange={updateMetadata}
          />
        </div>
      </div>
    </div>
  );
}
