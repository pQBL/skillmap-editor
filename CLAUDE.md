# CLAUDE.md - Repository Guide for LLMs

## Project Overview
**pqbl** is a TypeScript CLI tool that generates AI-powered educational quizzes for the Torus learning platform. It uses OpenAI's API to transform learning materials (PDFs, DOCX, PPTX, TXT) into structured multiple-choice questions with detailed feedback.

**Version**: 0.2.0
**Tech Stack**: TypeScript, Node.js (ESM), OpenAI API, Zod, neverthrow
**Build**: esbuild + TypeScript compiler
**Entry Point**: `src/cli/main.ts` → `dist/cli.js`

## Core Concepts

### Generation Pipeline
1. **Project** - Workspace with `pqbl.json` config + resources
2. **Resources** - Learning materials (PDF/DOCX/PPTX/TXT)
3. **Skillmap** - Extracted learning objectives and skills
4. **Course** - Generated quiz questions organized by modules/pages
5. **Export** - Torus-compatible "course digest" (zipped JSON)

### Data Models
```
Skillmap: Module → Objective → Skills (learning targets)
Course:   Module → Page → Questions (MCQs with feedback)
MCQ:      Stem + Choices[answer, feedback, score]
```

## Architecture

### Directory Structure (90 TypeScript files)
```
src/
├── ai/           # OpenAI client, prompt management, context building
├── cli/          # Commander.js setup, command handlers, user messages
├── generation/   # Core logic for skillmap/course generation
├── project/      # Config loading, path resolution, resource management
├── pubsub/       # Event system for generation pipeline coordination
├── shared/       # Utilities: JSON/string helpers, parsing, Zod schemas
├── storage/      # File I/O, PDF/DOCX/PPTX parsing
└── torus/        # Torus export format (digest creation, MCQ schemas)

templates/
├── prompts/      # English prompts for OpenAI
└── prompts-sv/   # Swedish prompts

tests/            # Jest tests
website/          # Docusaurus documentation site
```

### Path Aliases (tsconfig.json)
- `@cli/*` → `src/cli/*`
- `@generation/*` → `src/generation/*`
- `@torus/*` → `src/torus/*`
- `@ai/*` → `src/ai/*`
- `@project/*` → `src/project/*`
- `@shared/*` → `src/shared/*`
- `@storage/*` → `src/storage/*`
- `@pubsub/*` → `src/pubsub/*`

## Key Files

### Configuration
- **`pqbl.json`** - Project config (title, description, modules, generation settings)
- **`src/shared/schemas.ts`** - Zod schemas for all data structures
- **`src/shared/types.ts`** - TypeScript types derived from Zod schemas
- **`src/project/config.ts`** - Config loading and validation

### Generation
- **`src/generation/skillmap.ts`** - Skillmap generation orchestration
- **`src/generation/course.ts`** - Course generation orchestration
- **`src/generation/context.ts`** - Build context for AI prompts
- **`src/ai/openai.ts`** - OpenAI API client wrapper

### CLI
- **`src/cli/main.ts`** - Entry point with error handling
- **`src/cli/setup.ts`** - Commander.js CLI configuration
- **`src/cli/types.ts`** - CLI-specific types and interfaces
- **`src/cli/messages.ts`** - User-facing messages and prompts

### Export
- **`src/torus/exporter.ts`** - Main export logic
- **`src/torus/digest.ts`** - Torus course digest structure
- **`src/torus/mcq.ts`** - MCQ conversion to Torus format

## Configuration Schema (`pqbl.json`)

### Basic Structure
```json
{
  "title": "Course Title",
  "description": "Course description for AI context",
  "modules": ["Module 1", "Module 2"]
}
```

### Zod Schema Definition
```typescript
// src/shared/schemas.ts
export const pqblConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  learner: learnerSchema.optional(),
  modules: z.array(z.string()).optional(),
  // communication: communicationSchema.optional(),  // Commented out, in development
  // content: contentSchema.optional(),              // Commented out, in development
  // questions: questionSettingsSchema,              // Commented out, in development
});

// Learner settings (currently simple string, object version in development)
export const learnerSchema = z.string();

// Future learner object structure (not yet implemented)
export const learnerObjectSchema = z.object({
  level: z.string(),
  background: z.string(),
  language: languageSchema.default("en"),
  knows: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  needs: z.array(z.string()).default([]),
});

// Question settings schema
export const questionSettingsSchema = z.object({
  perSkill: z.union([positiveNumberSchema, rangeSchema]).default(DEFAULT_NUM_QUESTIONS_PER_SKILL),
  skillCombinations: z.union([z.boolean(), positiveNumberSchema, rangeSchema]).default(false),
  variants: positiveNumberSchema.default(DEFAULT_NUM_QUESTION_VARIANTS),
  hardLimitTotal: positiveNumberSchema.optional(),
});

// Range type for flexible numeric constraints
export const rangeSchema = z.object({
  target: positiveNumberSchema,
  tolerance: positiveNumberSchema,
});
```

### Advanced Settings (In Development)
```json
{
  "learner": {
    "level": "undergraduate",
    "background": "Computer science students",
    "language": "en",
    "knows": ["basic programming", "data structures"],
    "strengths": ["logical thinking"],
    "challenges": ["math notation"],
    "needs": ["visual examples"]
  },
  "communication": {
    "language": "en",
    "style": {
      "attitude": "friendly",
      "complexity": "moderate",
      "delivery": "conversational"
    }
  },
  "content": {
    "purpose": "Exam preparation",
    "include": ["code examples", "diagrams"],
    "exclude": ["historical context"]
  },
  "questions": {
    "perSkill": { "target": 3, "tolerance": 1 },
    "skillCombinations": true,
    "variants": 2,
    "hardLimitTotal": 50
  }
}
```

## Common Commands

### Project Management
```bash
pqbl project new "<name>"     # Create new project
pqbl config                   # View config
```

### Generation
```bash
pqbl skillmap generate [--language <lang>] [--resources <dir>] [--output <dir>]
pqbl course generate [--language <lang>] [--skillmap <path>] [--output <dir>]
```

### Export
```bash
pqbl course export <course-path>  # Export to Torus digest
```

## Development Workflow

### Build & Test
```bash
npm run build           # Typecheck → bundle → chmod
npm run build:typecheck # Type checking only
npm run build:bundle    # esbuild bundling only
npm test               # Run Jest tests
npm run lint           # ESLint
npm run lint:fix       # Auto-fix linting issues
```

### Git Workflow
- **Base branch**: `dev`
- **Branch naming**: `feat/<name>` or `fix/<name>`
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **PRs**: Target `dev`, not `main`

### Code Style
- Functional programming style preferred
- Use `neverthrow` Result types for error handling
- Zod schemas for runtime validation
- Descriptive variable names
- Run linting/formatting before commits (enforced by Husky)

## Important Patterns

### Error Handling
```typescript
import { Result, ok, err } from "neverthrow";

const loadConfig = (path: string): Result<Config, Error> =>
  ok()
    .andThen(() => readFileSafeSync(path))
    .andThen(parseConfig);
```

### Schema Validation
```typescript
import { z } from "zod";

const configSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(z.string())
});

type Config = z.infer<typeof configSchema>;
```

### Path Resolution
```typescript
// Project paths are resolved once during setup
type ProjectPaths = {
  basePath: string;        // Project root
  config: string;          // pqbl.json path
  resourcesDir: string;    // Default: resources/
  skillmapsDir: string;    // Default: skillmaps/
  coursesDir: string;      // Default: courses/
  exportsDir: string;      // Default: exports/
  skillmap?: string;       // Specific skillmap path
  course?: string;         // Specific course path
};
```

## Prompt Templates

Located in `templates/prompts/` (English) and `templates/prompts-sv/` (Swedish):

- **`skillmap_1_extract.md`** - Extract objectives/skills from resources
- **`skillmap_2_merge.md`** - Merge/deduplicate objectives
- **`skillmap_3_json.md`** - Format skillmap as structured JSON
- **`course_1.md`** - Generate MCQs from skillmap + resources
- **`pqbl_context.md`** - System context about pQBL methodology

## Key Dependencies

### Production
- **`openai`** (^4.67.1) - OpenAI API client
- **`commander`** (^12.1.0) - CLI framework
- **`zod`** (^4.1.11) - Schema validation
- **`neverthrow`** (^8.2.0) - Functional error handling
- **`chalk`** (^5.6.0) - Terminal colors
- **`pdfreader`** (^3.0.5) - PDF parsing
- **`officeparser`** (^5.0.0) - DOCX/PPTX parsing
- **`adm-zip`** (^0.5.16) - ZIP file creation
- **`ramda`** (^0.31.3) - Functional utilities

### Development
- **`typescript`** (^5.7.3) - Type system
- **`esbuild`** (0.25.8) - Fast bundler
- **`jest`** (^29.7.0) - Testing framework
- **`eslint`** (^9.21.0) - Linting
- **`prettier`** (^3.5.3) - Code formatting
- **`husky`** (^9.1.7) - Git hooks

## Special Considerations

### API Key Management
- Requires `PQBL_OPENAI_API_KEY` environment variable
- Set in `~/.bashrc` or `~/.zshrc`

### File Parsing
- **PDF**: Text extraction via `pdfreader`
- **DOCX/PPTX**: Content extraction via `officeparser`
- **TXT**: Direct UTF-8 reading

### Timestamps
- Output files use ISO 8601 format: `YYYYMMDDTHHMMSSSSZ`
- Example: `history_101_20250930t094355428z.json`

### Project Detection
- Projects identified by `pqbl.json` in root
- Most commands must run inside project directory
- Nested projects not supported

### Resource Discovery
- Default location: `resources/` in project root
- Supported extensions: `.pdf`, `.docx`, `.pptx`, `.txt`
- Recursive directory scanning

### Skillmap Selection
- If `--skillmap` not specified, uses most recently modified in `skillmaps/`
- Critical for course generation to match correct learning objectives

## Testing
- Tests located in `tests/`
- Jest configuration in `jest.config.mjs`
- Run with `npm test`
- Focus on CLI commands and core generation logic

## Documentation
- **User docs**: `README.md` (quickstart, examples)
- **Developer docs**: `devdocs/` (tips, troubleshooting)
- **Reference docs**: `docs/` (detailed guides)
- **Website**: `website/` (Docusaurus site)

## Current Branch
**`feat/comprehensive-config-#101`** - Working on enhanced configuration options (learner settings, communication style, content settings, question constraints)

## Detailed Schema Reference

### Skillmap Schema
```typescript
// src/shared/schemas.ts

// A skill is a specific learning target (e.g., "Explain the role of agriculture")
export const skillSchema = z.string();

// An objective groups related skills under a common goal
export const objectiveSchema = z.object({
  goal: z.string(),
  skills: z.array(skillSchema),
});

// A skillmap module represents one course module
export const skillmapModuleSchema = z.object({
  title: z.string(),
  objectives: z.array(objectiveSchema),
});

// The complete skillmap structure
export const skillmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(skillmapModuleSchema),
});
```

**Skillmap Example:**
```json
{
  "title": "History 101",
  "description": "A course about world history",
  "modules": [
    {
      "title": "Early civilization",
      "objectives": [
        {
          "goal": "Understand the foundations of early civilizations",
          "skills": [
            "Explain the role of agriculture in permanent settlements",
            "Identify features of Mesopotamian and Egyptian societies"
          ]
        }
      ]
    }
  ]
}
```

### Course Schema
```typescript
// src/shared/schemas.ts

// MCQ choice structure
export const mcqChoiceSchema = z.object({
  answer: z.string().describe("an mcq answer option"),
  feedback: z.string().describe(
    "guiding and encouraging feedback to the answer. " +
    "should declare if the answer is correct or incorrect. " +
    "should explain WHY it is correct/incorrect. " +
    "should NEVER give away correct answer."
  ),
  score: z.union([
    z.literal(MCQ_SCORE_INCORRECT),  // 0
    z.literal(MCQ_SCORE_CORRECT),     // 1
  ]),
});

// Multiple-choice question
export const mcqSchema = z.object({
  kind: z.literal("mcq"),
  stem: z.string().describe(
    "the skills used for this mcq. a mix of skills is encouraged. " +
    "should contain only the question stem (no meta descriptions)"
  ),
  skills: z.array(skillSchema),
  choices: z.array(mcqChoiceSchema),
});

// Currently only MCQ supported, extensible for other question types
export const questionSchema = mcqSchema;

// A page groups questions for a single learning objective
export const pageSchema = z.object({
  title: z.string(),
  objective: objectiveSchema,
  questions: z.array(questionSchema),
});

// A course module extends skillmap module with pages
export const courseModuleSchema = skillmapModuleSchema.extend({
  pages: z.array(pageSchema),
});

// The complete course structure
export const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(courseModuleSchema),
});
```

**Course Example (Single Module):**
```json
{
  "title": "History 101",
  "description": "A course about world history",
  "modules": [
    {
      "title": "Early civilization",
      "objectives": [
        {
          "goal": "Understand the foundations of early civilizations",
          "skills": [
            "Explain the role of agriculture in permanent settlements",
            "Identify features of Mesopotamian and Egyptian societies"
          ]
        }
      ],
      "pages": [
        {
          "title": "Foundations of Early Civilizations",
          "objective": {
            "goal": "Understand the foundations of early civilizations",
            "skills": [
              "Explain the role of agriculture in permanent settlements",
              "Identify features of Mesopotamian and Egyptian societies"
            ]
          },
          "questions": [
            {
              "kind": "mcq",
              "stem": "Why was agriculture crucial for early civilizations?",
              "skills": ["Explain the role of agriculture in permanent settlements"],
              "choices": [
                {
                  "answer": "It allowed surplus food production",
                  "feedback": "Correct! Surplus food enabled permanent settlements.",
                  "score": 1
                },
                {
                  "answer": "It eliminated disease",
                  "feedback": "Incorrect. Settlements actually increased disease spread.",
                  "score": 0
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Data Flow
```
Resources (PDF/DOCX/PPTX/TXT)
    ↓
Skillmap Generation (OpenAI)
    ↓
Skillmap JSON (objectives → skills)
    ↓
Course Generation (OpenAI)
    ↓
Course JSON (modules → pages → questions)
    ↓
Torus Export (course digest ZIP)
    ↓
Torus Platform Import
```

### Important Constants
```typescript
// src/shared/constants.ts
MCQ_SCORE_CORRECT = 1
MCQ_SCORE_INCORRECT = 0
DEFAULT_NUM_QUESTIONS_PER_SKILL = 3
DEFAULT_NUM_QUESTION_VARIANTS = 1
```

## Notes for LLM Assistance
- Prioritize functional style and immutability
- Use Result types for error handling (avoid throwing)
- Validate all external inputs with Zod schemas
- Maintain path alias consistency
- Add tests for new features
- Update schemas when adding config options
- Keep prompts in sync between English/Swedish versions
- Consider multi-language support in all user-facing text
- **Schema hierarchy**: Config → Skillmap → Course → Page → Question
- **1-to-1 mappings**: Skillmap Module ↔ Course Module, Objective ↔ Page
- **1-to-many**: Skill → Multiple Questions (configurable via `perSkill` setting)
