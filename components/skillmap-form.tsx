"use client";

import { type Skillmap, type SkillmapModule, type Objective } from "@/lib/schema";

interface SkillmapFormProps {
  skillmap: Skillmap;
  onChange: (skillmap: Skillmap) => void;
  selectedModuleIndex: number;
}

export function SkillmapForm({ skillmap, onChange, selectedModuleIndex }: SkillmapFormProps) {
  const updateModule = (index: number, module: SkillmapModule) => {
    const modules = [...skillmap.modules];
    modules[index] = module;
    onChange({ ...skillmap, modules });
  };

  const selectedModule = skillmap.modules[selectedModuleIndex];

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{
        marginBottom: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
        borderBottom: 'var(--border-width) solid var(--border-primary)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)'
        }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-on-primary)',
            background: 'var(--color-primary-500)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-base)',
            fontFamily: 'var(--font-mono)'
          }}>
            {selectedModuleIndex + 1}
          </span>
          <h2 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)'
          }}>
            {selectedModule?.title || `Module ${selectedModuleIndex + 1}`}
          </h2>
        </div>
      </div>

      {selectedModule && (
        <ModuleEditor
          module={selectedModule}
          onChange={(updated) => updateModule(selectedModuleIndex, updated)}
        />
      )}
    </div>
  );
}

interface ModuleEditorProps {
  module: SkillmapModule;
  onChange: (module: SkillmapModule) => void;
}

function ModuleEditor({ module, onChange }: ModuleEditorProps) {
  const updateTitle = (title: string) => {
    onChange({ ...module, title });
  };

  const updateObjective = (index: number, objective: Objective) => {
    const objectives = [...module.objectives];
    objectives[index] = objective;
    onChange({ ...module, objectives });
  };

  const addObjective = () => {
    onChange({
      ...module,
      objectives: [
        ...module.objectives,
        {
          goal: "New objective",
          skills: [],
        },
      ],
    });
  };

  const removeObjective = (index: number) => {
    if (confirm("Are you sure you want to remove this objective?")) {
      onChange({
        ...module,
        objectives: module.objectives.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <label style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-2)'
        }}>
          Module Title
        </label>
        <input
          type="text"
          value={module.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="input"
          placeholder="Enter module title..."
        />
      </div>

      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)'
        }}>
          <h3 style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Objectives
          </h3>
          <button
            onClick={addObjective}
            className="btn btn-primary"
            style={{
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--text-xs)'
            }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Objective
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {module.objectives.map((objective, index) => (
            <ObjectiveEditor
              key={index}
              objective={objective}
              onChange={(updated) => updateObjective(index, updated)}
              onRemove={() => removeObjective(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ObjectiveEditorProps {
  objective: Objective;
  onChange: (objective: Objective) => void;
  onRemove: () => void;
}

function ObjectiveEditor({ objective, onChange, onRemove }: ObjectiveEditorProps) {
  const updateGoal = (goal: string) => {
    onChange({ ...objective, goal });
  };

  const updateSkill = (index: number, skill: string) => {
    const skills = [...objective.skills];
    skills[index] = skill;
    onChange({ ...objective, skills });
  };

  const addSkill = () => {
    onChange({
      ...objective,
      skills: [...objective.skills, "New skill"],
    });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...objective,
      skills: objective.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      padding: 'var(--space-4)',
      border: 'var(--border-width) solid var(--border-primary)',
      borderRadius: 'var(--radius-base)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{ flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)'
          }}>
            Goal
          </label>
          <input
            type="text"
            value={objective.goal}
            onChange={(e) => updateGoal(e.target.value)}
            className="input"
            placeholder="Enter objective goal..."
          />
        </div>
        <button
          onClick={onRemove}
          title="Remove objective"
          style={{
            marginLeft: 'var(--space-3)',
            padding: 'var(--space-2)',
            color: 'var(--color-error)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 'var(--radius-base)',
            transition: 'background-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)'
        }}>
          <label style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-secondary)'
          }}>
            Skills
          </label>
          <button
            onClick={addSkill}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--text-on-primary)',
              background: 'var(--color-neutral-600)',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-neutral-700)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-neutral-600)'}
          >
            + Add Skill
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {objective.skills.map((skill, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                className="input"
                placeholder="Enter skill..."
                style={{ flex: 1 }}
              />
              <button
                onClick={() => removeSkill(index)}
                title="Remove skill"
                style={{
                  padding: 'var(--space-2)',
                  color: 'var(--color-error)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-base)',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-error-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
