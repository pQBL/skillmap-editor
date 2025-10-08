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
      height: '100%'
    }}>
      <h3 style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        Skillmap Metadata
      </h3>

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
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange(e.target.value, description)}
          className="input"
          placeholder="Enter skillmap title..."
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-medium)'
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
          rows={8}
          placeholder="Enter skillmap description..."
          style={{
            resize: 'vertical',
            minHeight: '120px'
          }}
        />
      </div>
    </div>
  );
}
