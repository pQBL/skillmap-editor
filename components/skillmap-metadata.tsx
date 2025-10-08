"use client";

interface SkillmapMetadataProps {
  title: string;
  description: string;
  onChange: (title: string, description: string) => void;
  onCollapse: () => void;
}

export function SkillmapMetadata({ title, description, onChange, onCollapse }: SkillmapMetadataProps) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      padding: 'var(--space-6)',
      height: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        <h3 style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Skillmap Metadata
        </h3>
        <button
          onClick={onCollapse}
          className="btn btn-secondary"
          style={{
            padding: 'var(--space-1)',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Collapse sidebar"
        >
          <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

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
