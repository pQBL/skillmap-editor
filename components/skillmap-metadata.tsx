"use client";

interface SkillmapMetadataProps {
  title: string;
  description: string;
  onChange: (title: string, description: string) => void;
}

export function SkillmapMetadata({ title, description, onChange }: SkillmapMetadataProps) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      padding: 'var(--space-6)',
      borderBottom: 'var(--border-width) solid var(--border-primary)'
    }}>
      <div style={{
        marginBottom: 'var(--space-5)'
      }}>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-2)'
        }}>
          Skillmap Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange(e.target.value, description)}
          className="input"
          placeholder="Enter skillmap title..."
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)'
          }}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-2)'
        }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onChange(title, e.target.value)}
          className="input"
          rows={3}
          placeholder="Enter skillmap description..."
          style={{
            resize: 'vertical',
            minHeight: '80px'
          }}
        />
      </div>
    </div>
  );
}
