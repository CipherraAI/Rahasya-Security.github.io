# Platform Design Document
**Agent Eval & RL Rollout Platform**

> Run agent evals at scale. Get prioritized, actionable diagnostics — not just a score.

---

## Table of Contents

1. [Vision & Problem](#1-vision--problem)
2. [Target Users](#2-target-users)
3. [Core Concepts](#3-core-concepts)
4. [Product Tiers](#4-product-tiers)
5. [System Architecture](#5-system-architecture)
6. [Component Specifications](#6-component-specifications)
7. [Data Model](#7-data-model)
8. [API Design](#8-api-design)
9. [Execution Engine](#9-execution-engine)
10. [Diagnostic Layer](#10-diagnostic-layer)
11. [Security](#11-security)
12. [Observability](#12-observability)
13. [V1 vs V2 Feature Matrix](#13-v1-vs-v2-feature-matrix)
14. [Milestones & Tasks](#14-milestones--tasks)

---

## 1. Vision & Problem

### The problem

Teams training or fine-tuning language models — especially with RL post-training — have no reliable way to know if their model is improving between checkpoints. They have:

- Training loss curves (unreliable proxy for capability, especially under RL)
- Manual eval runs they script themselves (no standardization, no CI trigger)
- Raw scores with no explanation of *why* tasks fail

When a task fails, a developer today reads through trajectory JSON files manually to diagnose the issue. This takes hours and requires deep familiarity with the harness internals.

### The solution

A platform that:
1. Runs agent eval jobs at scale, on demand, with redundancy
2. Classifies every failure by root cause (config issue vs. model behavior)
3. Returns a prioritized, actionable debug report — not just a score

The eval run is the mechanism. The diagnostic report is the value.

### What this is not

- A training platform (we run evals, not gradient steps — V2 may close this loop)
- A prompt engineering tool (we evaluate agent trajectories, not single LLM calls)
- A benchmarking leaderboard (results are private per user)

---

## 2. Target Users

**Primary: ML engineers doing RL post-training**
- Fine-tuning Llama/Qwen/Mistral for coding, reasoning, or agent tasks
- Running GRPO/PPO/DPO and need to know if each training run improved capability
- Currently scripting their own eval pipelines against lm-eval-harness or custom tasks

**Secondary: AI teams evaluating agent systems**
- Teams building coding agents, task automation, or multi-step reasoning systems
- Want to run eval suites against their system before shipping changes
- Currently using Harbor + Modal/Daytona manually with no diagnostic layer

**V2 target: Labs and startups running RL at scale**
- Need continuous eval-on-checkpoint as part of training infrastructure
- Want eval → train → eval loop automation
- Need GPU sharing to reduce inference cost during rollout collection

---

## 3. Core Concepts

**Job** — the top-level unit of work a user submits. Contains:
- A task suite (one or more tasks in Harbor format)
- A model config (API key + endpoint, or hosted model)
- Redundancy N (how many independent runs per task)
- Timeout and step limit settings

**Task** — a single eval problem. Follows Harbor task format:
- `instruction.md` — what the agent should do
- `environment/Dockerfile` — starting container state
- `tests/test.sh` — verifier that writes `reward.txt` (0–100)
- `task.toml` — metadata and resource limits

**Run** — one container execution of one task. A job with 10 tasks and redundancy=3 produces 30 runs.

**Redundancy** — running the same task N times independently. Necessary because LLM outputs are non-deterministic. Results are averaged; variance is surfaced. A task that passes 1/5 runs is flagged differently from one that passes 0/5.

**Diagnostic Report** — produced after all runs complete. Classifies failures, ranks issues by impact and fixability, and provides specific remediation steps.

---

## 4. Product Tiers

### V1 Launch

| | Free | — |
|---|---|---|
| Jobs | 5 lifetime | — |
| Tasks per job | up to 50 | — |
| Redundancy | up to 3 | — |
| Model support | Any OpenAI-compatible API — BYOK (Anthropic, OpenAI, Together, etc.) or self-hosted endpoint (vLLM, Ollama, etc.) | — |
| Diagnostics | Rule-based config layer | — |
| Dashboard | Score + diagnostic report | — |

Free tier is the only tier at launch. Pricing TBD after beta feedback.

### V2 (Post-beta)

- Paid tier: usage-based (per run-minute)
- Hosted open-source models (GPU shared across jobs, ~10x cheaper per run than DIY)
- LLM-powered trajectory diagnostics
- Self-hosted model endpoint support
- Checkpoint/resume for long-running jobs
- Training loop integration (eval → collect trajectories → trigger fine-tuning)

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend                                                       │
│  Next.js — job submission, dashboard, diagnostic report viewer  │
│  Hosted on Vercel, custom domain                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST
┌──────────────────────────▼──────────────────────────────────────┐
│  API Server (FastAPI)                                           │
│  Auth · Job CRUD · Result queries · Log streaming (SSE)        │
└────┬──────────────────────────────────────────┬────────────────-┘
     │ enqueue tasks                             │ read / write
┌────▼───────────┐                    ┌──────────▼──────────────┐
│  Job Queue     │                    │  PostgreSQL              │
│  Redis+Celery  │                    │  jobs, runs, diagnostics │
└────┬───────────┘                    └─────────────────────────-┘
     │
┌────▼──────────────────────────────────────────────────────────-─┐
│  Worker Pool (on execution VM)                                  │
│                                                                 │
│  validate_job ──► spawn_runs (×N) ──► aggregate ──► diagnose   │
└────┬────────────────────────────────────────────────────────────┘
     │ Docker SDK
┌────▼──────────────────────────────────────────────────────────-─┐
│  Docker Engine (same VM)                                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Run 1      │  │  Run 2      │  │  Run N      │            │
│  │  task_001   │  │  task_001   │  │  task_002   │  ...       │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  All containers use pre-baked base image (no install overhead) │
└────┬──────────────────────────────────────────────────────────-─┘
     │ logs + result.json + trajectory.json
┌────▼──────────────────────────────────────────────────────────-─┐
│  Object Storage (Cloudflare R2)                                 │
│  jobs/{job_id}/runs/{run_id}/agent.txt                          │
│  jobs/{job_id}/runs/{run_id}/trajectory.json                    │
│  jobs/{job_id}/runs/{run_id}/result.json                        │
└─────────────────────────────────────────────────────────────────┘

External (user-provided):
  Model API endpoint (Anthropic / OpenAI / Together / custom)
```

### Infrastructure (V1)

| Component | Choice | Rationale |
|---|---|---|
| Execution VM | Hetzner CX32 — 4 vCPU, 8GB RAM, EU | ~$15/month flat. Best price/performance available. 20TB egress free. Start here, upgrade to CX42 (~$31/month) if beta demands it. |
| API + workers | Same VM as execution | Simpler ops for V1 |
| Database | Supabase (free tier) | Managed Postgres, free up to 500MB |
| Job queue | Redis (Upstash free) + Celery | Simple, battle-tested |
| Object storage | Cloudflare R2 | Free egress always, 10GB free tier |
| Frontend | Vercel (free tier) | Zero-config Next.js deploy |
| Log sink | Axiom (free tier) | Structured logs, queryable |

**On EU location:** Shared vCPUs on Hetzner are EU-only. This is not a concern for this workload. The VM is an async job runner — it makes outbound HTTPS calls to model APIs (Anthropic/OpenAI, US-based) and responds to user API requests. The ~80–100ms EU→US RTT adds roughly 1–2 seconds across a 20-step eval run, completely dominated by LLM generation time (1–5s per call). No user will notice. Revisit location only if a specific regulatory or co-location requirement emerges.

**No US alternative matches Hetzner's price.** Vultr US runs ~$48/month for equivalent specs, DigitalOcean ~$96/month. The 3x premium buys better managed services but not better raw compute. For a beta running on free-tier managed services (Supabase, Upstash, R2), the premium disappears entirely.

---

## 6. Component Specifications

### 6.1 Pre-baked Base Image

Built once by the platform, pushed to a container registry. All eval containers start from this image — no per-job install step.

```dockerfile
FROM python:3.11-slim

# System deps
RUN apt-get update && apt-get install -y curl git build-essential && rm -rf /var/lib/apt/lists/*

# Install uv for fast Python tooling
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Pre-install mini-swe-agent (pinned version)
RUN uv tool install "mini-swe-agent==2.2.8"

# Harbor task runner shim (our lightweight wrapper, not full Harbor CLI)
COPY platform_runner/ /opt/platform_runner/
RUN pip install -e /opt/platform_runner/

WORKDIR /workspace
```

The `platform_runner` is a thin wrapper (adapted from InstaML's `harness/entrypoint.py`) that:
- Reads task from `/workspace/instruction.md`
- Runs mini-swe-agent in text-based mode (no tool-calling, works with any model)
- Writes steps to `/workspace/steps.jsonl` in real-time
- Scores via `tests/test.sh`, writes `/workspace/result.json`

This avoids Harbor's full `BaseInstalledAgent` install overhead (~60s per container → ~2s with cached image).

### 6.2 API Server

FastAPI application. Key responsibilities:
- Job submission and validation
- Serving job status and results
- Streaming logs via Server-Sent Events (SSE)
- API key encryption/decryption at boundary

### 6.3 Worker Pool

Celery workers. Three task types:

```
validate_job(job_id)
  → parses task files, checks API key reachability, enqueues runs

run_container(run_id)
  → pulls base image, injects task files, starts container
  → streams stdout to R2
  → on completion: parses result.json, classifies failure type
  → signals aggregator when all runs for a job are done

aggregate_and_diagnose(job_id)
  → waits for all runs to complete
  → computes per-task pass rate, average score, variance
  → runs diagnostic layer
  → writes final report to DB
```

### 6.4 Container Runner

Wraps Docker SDK. Responsibilities:
- Start container with task files mounted
- Pass model config as environment variables (`MODEL_BASE_URL`, `MODEL`, `API_KEY`)
- Stream stdout line-by-line to R2 as it arrives
- Enforce hard timeout via `docker stop`
- Capture exit code + parse result.json on completion
- Clean up container after result extracted

### 6.5 Log Collector

Streams container stdout to R2 in real-time. Also emits structured events to the log sink (Axiom) at key points. Frontend polls via SSE for live log tailing.

---

## 7. Data Model

### jobs
```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL
status          ENUM('submitted','validating','queued','running','aggregating','complete','failed')
model_name      TEXT NOT NULL              -- e.g. "claude-haiku-4-5"
api_base        TEXT                       -- null = use default provider base URL
api_key_enc     BYTEA NOT NULL             -- AES-256 encrypted, never logged
task_source     JSONB                      -- task file references or bundle path
task_count      INT NOT NULL
redundancy      INT NOT NULL DEFAULT 1
step_limit      INT NOT NULL DEFAULT 50
timeout_minutes INT NOT NULL DEFAULT 30
created_at      TIMESTAMPTZ DEFAULT now()
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
-- aggregate results (denormalized for fast dashboard queries)
aggregate_score FLOAT
pass_rate       FLOAT
score_variance  FLOAT
```

### runs
```sql
id              UUID PRIMARY KEY
job_id          UUID REFERENCES jobs(id)
task_id         TEXT NOT NULL              -- e.g. "task_001"
run_index       INT NOT NULL               -- 1..N (redundancy slot)
status          ENUM('queued','running','complete','failed')
score           FLOAT
failure_type    TEXT                       -- see failure taxonomy below
error_message   TEXT
steps_taken     INT
tokens_used     INT
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
-- R2 paths
log_path        TEXT
trajectory_path TEXT
result_path     TEXT
```

### diagnostics
```sql
id              UUID PRIMARY KEY
job_id          UUID REFERENCES jobs(id)
task_id         TEXT                       -- null = job-level diagnostic
severity        ENUM('critical','likely','possible')
category        ENUM('config','api','model_behavior','task_config')
issue_code      TEXT                       -- e.g. "STEP_LIMIT_TOO_LOW"
title           TEXT
description     TEXT
suggested_fix   TEXT
affected_runs   INT
confidence      FLOAT                      -- 0.0-1.0
created_at      TIMESTAMPTZ DEFAULT now()
```

### users
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE NOT NULL
jobs_remaining  INT DEFAULT 5              -- free tier counter
created_at      TIMESTAMPTZ DEFAULT now()
```

---

## 8. API Design

### Job lifecycle

```
POST   /jobs                    Submit a new job
GET    /jobs/{id}               Job status + aggregate results
GET    /jobs/{id}/runs          All runs for a job (paginated)
GET    /jobs/{id}/runs/{run_id} Single run detail + failure type
GET    /jobs/{id}/diagnostics   Prioritized diagnostic report
GET    /jobs/{id}/logs          SSE stream of live container logs
DELETE /jobs/{id}               Cancel a running job
```

### Tasks

```
POST   /tasks/validate          Validate task file bundle before submission
GET    /tasks/examples          Example task library (curated starters)
```

### Auth

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

### Job submission payload

```json
{
  "model_name": "claude-haiku-4-5",
  "api_key": "sk-ant-...",
  "api_base": null,
  "redundancy": 3,
  "step_limit": 50,
  "timeout_minutes": 30,
  "tasks": {
    "type": "bundle",
    "files": { ... }
  }
}
```

---

## 9. Execution Engine

### Why Harbor format but not Harbor CLI

Harbor's task format (`task.toml` + `instruction.md` + `tests/test.sh`) is the right user-facing interface — it's clean, growing in adoption, and has an existing task library. However, Harbor's CLI is not designed to be embedded in a platform:

- No programmatic job API (CLI-only)
- No checkpoint/resume
- `BaseInstalledAgent` adds 60s install overhead per container
- No multi-tenant isolation

**Decision:** Accept Harbor task format as input. Run containers using our own thin runner (`platform_runner`) that pre-bakes the harness. Bypass Harbor's orchestrator entirely — we replace it with Celery workers + Docker SDK.

### Text-based mode

All eval runs use mini-swe-agent in text-based mode (`LitellmTextbasedModel` + `mini_textbased.yaml` config). This works with any OpenAI-compatible endpoint without requiring `--enable-auto-tool-choice` on the model server. Critical for BYOK where users bring diverse model endpoints.

### Concurrency model

```
CX32 VM: 8GB RAM
Each container: ~400MB peak RAM
Safe concurrent containers: 15-18
Celery concurrency: 16 workers, each manages one container
```

For a job with 10 tasks and redundancy=3 → 30 runs:
- Up to 16 containers run simultaneously; remaining queue behind them
- Each container streams logs independently
- Aggregation fires when the last container finishes

Upgrade to CX42 (16GB, ~$31/month) when beta load consistently saturates the queue — that raises the concurrency cap to 25–30.

### Container environment variables

```
MODEL_BASE_URL   → user's api_base (or provider default)
MODEL            → user's model_name
API_KEY          → decrypted at worker, injected at runtime, never persisted post-run
STEP_LIMIT       → from job config
TEMPERATURE      → from job config (default 0.7)
```

---

## 10. Diagnostic Layer

### V1: Rule-based config diagnostics

Runs immediately after aggregation. No LLM call required. Deterministic.

#### Failure taxonomy

```
infra.oom              Container killed with exit 137
infra.docker_error     Docker daemon failure, image pull error
infra.timeout          Hard timeout hit (container killed by platform)
api.auth               HTTP 401 from model provider
api.rate_limit         HTTP 429 from model provider
api.provider_error     HTTP 5xx from model provider
api.unreachable        Connection refused / DNS failure to model endpoint
agent.timeout          Agent step limit reached without submission
agent.format_error     Agent produced 0 valid actions (format not followed)
agent.context_exceeded Model context window exceeded mid-run
agent.wrong_answer     Ran cleanly, verifier returned reward=0
task.config_error      All runs fail at identical step → likely task bug
```

#### Diagnostic rules

```python
# STEP_LIMIT_TOO_LOW
# Condition: >50% of runs hit agent.timeout, median steps_taken >= step_limit
# Severity: CRITICAL
# Fix: "Increase STEP_LIMIT from {current} to at least {median_steps * 1.5:.0f}"

# FORMAT_NOT_FOLLOWED
# Condition: >30% of runs have agent.format_error
# Severity: CRITICAL
# Fix: "Model is not producing mswea_bash_command blocks. Add explicit format
#        instructions to your system prompt or switch to a model that follows
#        instruction formats more reliably."

# HIGH_VARIANCE
# Condition: same task passes in some runs, fails in others; score std_dev > 0.3
# Severity: LIKELY
# Fix: "High variance across {n} redundant runs suggests temperature={temp} is
#        too high. Try 0.2-0.3 for more consistent results."

# CONTEXT_EXCEEDED
# Condition: any runs hit agent.context_exceeded
# Severity: CRITICAL
# Fix: "Model hit context limit at step {step}. Task produces high-volume output.
#        Consider adding output truncation to the task's test setup."

# CONSISTENT_FAILURE_POINT
# Condition: >80% of failed runs fail at the same step number
# Severity: LIKELY (task config) or POSSIBLE (model behavior)
# Fix: "All failures occur at step {step}. Check task setup — this pattern
#        suggests a deterministic environment issue rather than model capability."

# API_AUTH_FAILURE
# Condition: any run has api.auth
# Severity: CRITICAL
# Fix: "API key returned 401. Verify key is valid and has sufficient credits
#        for model {model_name}."

# PROVIDER_OVERLOADED
# Condition: >20% of runs have api.provider_error or api.rate_limit
# Severity: LIKELY
# Fix: "Provider returned repeated 5xx/429 errors. Runs were retried where
#        possible. Consider re-running this job during off-peak hours."
```

#### Diagnostic report output

Sorted by: severity → breadth (affected_runs count) → fixability (config > prompt > model)

```
Job: my-coding-eval | 10 tasks | 3 runs each | 30 total runs

SUMMARY
  Passed (all runs):     3 tasks
  Passed (some runs):    2 tasks  ← inconsistent
  Failed (all runs):     5 tasks

─────────────────────────────────────────────────────

🔴 CRITICAL — Fix immediately (affects 15/30 runs, 5 tasks)
   STEP_LIMIT_TOO_LOW
   Step limit is 20. Median completion requires 31 steps.
   → Set STEP_LIMIT to 46 in your job config.

🟡 LIKELY — High confidence (affects 6/30 runs, 2 tasks)
   HIGH_VARIANCE
   Tasks 004, 007 pass in 1-2/3 runs with high score variance (σ=0.47).
   → Reduce temperature from 0.9 → 0.3 for consistent results.

🔵 POSSIBLE — Review recommended (affects 3/30 runs, 1 task)
   CONSISTENT_FAILURE_POINT
   Task 009: all 3 runs fail at step 4 with identical error.
   → Likely a task config issue, not model capability. Check task 009 setup.
```

### V2: LLM-powered trajectory diagnostics

After rule-based pass completes, for tasks with pass rate < 100% and no clear config explanation, send trajectory to analysis LLM.

**Trajectory analysis prompt structure:**
```
You are analyzing an AI agent's failed attempt at a coding task.

TASK: {instruction}
PASS RATE: {pass_rate} ({n_passed}/{n_total} runs)

TRAJECTORY (failed run):
{trajectory as action/observation pairs, truncated to last 20 steps}

PASSING RUN TRAJECTORY (for comparison):
{trajectory from a passing run on same task, if available}

Identify:
1. The specific step where the agent's approach diverged from correct
2. One named failure pattern from: [loop_detected, ignoring_observations,
   premature_submission, wrong_scope, exploration_without_progress,
   incorrect_error_diagnosis, other]
3. One concrete prompt or system instruction change that would address it

Respond in JSON only.
```

**Output stored as diagnostic record with category=`model_behavior`.**

---

## 11. Security

### API key handling

User API keys are the most sensitive data in the system.

- **Encrypt at rest**: AES-256-GCM with a KMS-managed key (AWS KMS or Cloudflare KMS). Never store plaintext.
- **In-memory only at runtime**: Worker decrypts key immediately before container spawn, passes as env var, does not log it, does not persist post-run.
- **Key validation at submission**: Make a low-cost test call (e.g. list models) to verify the key works before accepting the job. Fail fast rather than burning run attempts.
- **No key in logs**: Celery task args, Docker inspect output, and application logs must never contain the key. Use a placeholder `[REDACTED]` in any log context that includes env vars.
- **Deletion on request**: `DELETE /auth/me` removes user record and re-encrypts (voids) stored keys within 24h.

### Container isolation

- Each container runs with `--network=bridge` (no host network)
- No volume mounts to host filesystem except read-only task files
- Resource limits enforced: `--memory=512m --cpus=0.5` per container
- Containers run as non-root user inside image

### Multi-tenancy

- All DB queries scoped by `user_id` at API layer
- R2 paths include `user_id` prefix — no cross-user path access possible
- Job IDs are UUIDs — not sequential, not guessable

---

## 12. Observability

### Structured log events

Emitted to Axiom (or equivalent) at every state transition:

```python
# Key events
"job.submitted"          {job_id, user_id, task_count, redundancy, model}
"job.validation_failed"  {job_id, reason}
"run.started"            {run_id, job_id, task_id, run_index}
"run.step"               {run_id, step_n, tokens_used}       # sampled, not every step
"run.completed"          {run_id, score, steps, duration_s}
"run.failed"             {run_id, failure_type, error_summary}
"job.completed"          {job_id, pass_rate, aggregate_score, duration_s, total_tokens}
"job.diagnostic_ready"   {job_id, n_issues, top_severity}
```

### Metrics to track (for platform health)

- Container start latency (image pull + container ready)
- Run failure rate by failure_type
- Average job duration by task_count
- Queue depth (jobs waiting for container slots)
- API error rate by provider (Anthropic vs OpenAI vs other)

### Alerts

- Queue depth > 10 for > 5 minutes → execution bottleneck
- Run failure rate (infra types) > 15% in 1h window → VM or Docker issue
- API auth failures > 5 in 1h → possible provider outage or key rotation issue

---

## 13. V1 vs V2 Feature Matrix

| Feature | V1 | V2 |
|---|---|---|
| BYOK (Anthropic, OpenAI, Together, any OpenAI-compatible) | ✅ | ✅ |
| Self-hosted model endpoint (vLLM, Ollama, custom) | ✅ | ✅ |
| On-demand job submission | ✅ | ✅ |
| Redundancy (N runs, averaged) | ✅ | ✅ |
| Harbor task format input | ✅ | ✅ |
| Pre-baked base image (no install overhead) | ✅ | ✅ |
| Rule-based config diagnostics | ✅ | ✅ |
| Prioritized diagnostic report | ✅ | ✅ |
| Dashboard (scores + report) | ✅ | ✅ |
| Live log streaming | ✅ | ✅ |
| Free tier (5 jobs) | ✅ | ✅ |
| LLM-powered trajectory diagnostics | ❌ | ✅ |
| Cross-run pattern synthesis | ❌ | ✅ |
| Hosted open-source models (shared GPU) | ❌ | ✅ |
| Checkpoint / pause / resume | ❌ | ✅ |
| Eval-on-checkpoint webhook trigger | ❌ | ✅ |
| RL training loop integration | ❌ | ✅ |
| BYOC (bring your own container) | ❌ | ✅ |
| Scheduled / recurring jobs | ❌ | ✅ |

---

## 14. Milestones & Tasks

### Milestone 1 — Foundation
**Goal:** Repo structure, base image, local dev environment running end-to-end.
**Target:** 1–2 weeks

- [ ] Set up monorepo structure: `api/`, `worker/`, `platform_runner/`, `frontend/`, `infra/`
- [ ] Set up PostgreSQL schema (all tables from §7)
- [ ] Set up Redis (local Docker for dev, Upstash for prod)
- [ ] Set up Cloudflare R2 bucket + credentials
- [ ] Build pre-baked base Docker image (mini-swe-agent 2.2.8 pre-installed)
- [ ] Push base image to container registry (Docker Hub or GitHub Container Registry)
- [ ] Implement `platform_runner` (thin wrapper from InstaML `harness/entrypoint.py` + `mini_textbased.yaml` model class fix)
- [ ] Verify base image + platform_runner runs task_001 (fibonacci) correctly
- [ ] FastAPI skeleton: health check, basic project structure, Alembic migrations
- [ ] Celery + Redis worker skeleton: one dummy task that logs and returns
- [ ] Local dev: `docker-compose.yml` that starts postgres, redis, api, worker together

**Exit criteria:** `docker-compose up` starts all services; a dummy job moves through the queue and writes a result to the DB.

---

### Milestone 2 — Execution Engine
**Goal:** A job submitted via API spawns real containers, runs tasks, and stores results.
**Target:** 2 weeks

- [ ] `POST /jobs` endpoint: accept job payload, validate, store to DB
- [ ] `validate_job` Celery task: check task file structure, test API key with a lightweight call
- [ ] `run_container` Celery task: Docker SDK integration
  - Pull/use base image
  - Mount task files (instruction.md, tests/, environment/Dockerfile)
  - Inject env vars (MODEL, API_KEY, etc.)
  - Resource limits (memory, CPU)
  - Enforce timeout with `docker stop`
- [ ] Log streaming: container stdout → R2 in real-time
- [ ] Result parsing: read `result.json` from container, classify `failure_type`
- [ ] `GET /jobs/{id}` and `GET /jobs/{id}/runs` endpoints
- [ ] Failure classification: implement all failure types from §10 taxonomy
- [ ] Container cleanup after result extracted
- [ ] Self-hosted model support:
  - `api_base` accepted in job submission payload (already in API design — wire it through to `MODEL_BASE_URL` env var)
  - Endpoint reachability check at validation time (HTTP GET to `{api_base}/models`, fail fast before queuing)
  - Latency probe: measure p50 response time on validation call, surface as warning if >3s ("your endpoint may be slow — container timeouts have been adjusted")
  - Support `hosted_vllm/` model name prefix passthrough via LiteLLM
- [ ] End-to-end test: submit job via API → containers run → results in DB
- [ ] End-to-end test: submit job with custom `api_base` pointing at a local vLLM → runs correctly

**Exit criteria:** Submit a 3-task job via `curl` with both a hosted API key and a custom `api_base` endpoint. Both paths run, results appear in DB with correct failure types.

---

### Milestone 3 — Redundancy & Aggregation
**Goal:** N runs per task, averaged results, variance surfaced.
**Target:** 1 week

- [ ] `spawn_runs` fan-out: for each task × redundancy, create run records and enqueue `run_container`
- [ ] Completion tracking: detect when all runs for a job are done (Celery chord or polling)
- [ ] `aggregate_and_diagnose` task:
  - Per-task: pass rate, average score, score std dev
  - Per-job: overall pass rate, aggregate score
  - Write aggregate fields to `jobs` table
- [ ] Variance flag: mark tasks with std dev > 0.3 as `high_variance`
- [ ] `GET /jobs/{id}` returns aggregate + per-task breakdown
- [ ] Concurrency cap: enforce max 28 simultaneous containers (Celery concurrency setting)

**Exit criteria:** Submit job with redundancy=3, 5 tasks → 15 runs fire, aggregate score computed correctly, variance flagged where applicable.

---

### Milestone 4 — Diagnostic Layer V1
**Goal:** Every completed job has a prioritized diagnostic report.
**Target:** 1 week

- [ ] Implement all diagnostic rules from §10
  - `STEP_LIMIT_TOO_LOW`
  - `FORMAT_NOT_FOLLOWED`
  - `HIGH_VARIANCE`
  - `CONTEXT_EXCEEDED`
  - `CONSISTENT_FAILURE_POINT`
  - `API_AUTH_FAILURE`
  - `PROVIDER_OVERLOADED`
- [ ] Write diagnostic records to `diagnostics` table after aggregation
- [ ] Sort diagnostics by severity → affected_runs → fixability
- [ ] `GET /jobs/{id}/diagnostics` returns sorted report
- [ ] Add diagnostic summary to `GET /jobs/{id}` response (top issue only)
- [ ] Unit tests: one test per diagnostic rule with synthetic run data

**Exit criteria:** Given a set of synthetic run results, the correct diagnostics are generated and correctly prioritized.

---

### Milestone 5 — Dashboard
**Goal:** Users can submit jobs and see results without touching the API directly.
**Target:** 2 weeks

- [ ] Auth flow: email/password registration + login (JWT tokens)
- [ ] Job submission page: form with model config, task upload, redundancy slider
- [ ] Jobs list page: all user's jobs, status, summary score
- [ ] Job detail page:
  - Aggregate score + pass rate
  - Per-task results table (task name, pass rate, avg score, variance flag)
  - Diagnostic report panel (prioritized issues, expandable)
- [ ] Log viewer: tail live container logs via SSE during active runs
- [ ] Trajectory viewer: basic step-by-step view of agent actions + observations (read from R2)
- [ ] Free tier counter: show "X of 5 free jobs used"
- [ ] API key input: masked, never echoed back in UI, cleared on page reload

**Exit criteria:** Complete end-to-end user flow in browser without touching CLI.

---

### Milestone 6 — Beta Launch
**Goal:** Stable enough to share with 10–20 external users.
**Target:** 1 week

- [ ] Deploy to Hetzner CX32 VM (EU): API, workers, Docker engine
- [ ] Deploy frontend to Vercel + configure custom domain
- [ ] Set up Supabase (managed Postgres) + Upstash Redis in prod
- [ ] Configure Axiom log sink + set up key dashboards
- [ ] Set up alerts (queue depth, failure rate, auth errors)
- [ ] Per-user job cap enforcement (5 free jobs)
- [ ] Per-job task limit enforcement (max 50 tasks)
- [ ] Load test: simulate 5 concurrent jobs, 10 tasks each, verify no container leak or queue deadlock
- [ ] Security review: confirm API keys never appear in logs or R2 paths
- [ ] Rate limit API endpoints (per-IP + per-user)
- [ ] Write onboarding email template: what to try, how to structure tasks, what the diagnostic report means
- [ ] Soft launch to 5–10 network contacts

**Exit criteria:** 10 beta users can submit jobs independently. No critical failures in first 48h.

---

### Milestone 7 — LLM Diagnostic Engine (V2)
**Goal:** Trajectory analysis for failed tasks where rule-based diagnostics are inconclusive.
**Target:** 2 weeks post-beta

- [ ] Design failure mode taxonomy (start with 6–8 named patterns from §10)
- [ ] Implement trajectory formatter: condense ATIF trajectory to prompt-sized representation
- [ ] Implement analysis LLM call: structured prompt → JSON failure mode + suggested fix
- [ ] Store results in `diagnostics` table with `category='model_behavior'`
- [ ] Integrate into dashboard: separate section for behavior diagnostics
- [ ] Cross-run synthesis: when same failure mode appears in >50% of failed runs, surface as job-level insight
- [ ] Before/after comparison: if a passing run exists for same task, include in prompt

---

### Milestone 8 — GPU Infrastructure & Shared Inference (V2)
**Goal:** Host open-source models on shared L40S instances; users pay per run-minute.
**Target:** 3–4 weeks

- [ ] GPU provisioner: RunPod API integration (provision → wait for ready → register endpoint)
- [ ] vLLM lifecycle manager: start, health check, auto-restart on crash
- [ ] Model catalog: curated list of supported models (Qwen, Llama, Mistral families)
- [ ] Shared request router: multiple jobs → one vLLM instance, queued via request proxy
- [ ] Warm model caching: don't tear down vLLM between jobs using the same model
- [ ] Billing hooks: per run-minute metering events
- [ ] Checkpoint / resume: sync job checkpoint to R2 on each run completion; restore on new hardware
- [ ] Multi-provider fallback: RunPod → Lambda Labs if L40S unavailable

---

### Milestone 9 — Training Loop Integration (V2)
**Goal:** Close the eval → train → eval loop.
**Target:** 4–6 weeks

- [ ] Checkpoint webhook: user registers S3/HF path; new checkpoint triggers eval job
- [ ] Trajectory export: download all run trajectories as JSONL for RL training data
- [ ] veRL / TRL integration: after eval completes, optionally trigger a training job
- [ ] Eval curves: surface eval score vs training step on a unified chart
- [ ] Regression detection: flag when a checkpoint drops below a configured threshold on any capability category

---

## Appendix: Key Design Decisions

**Why pre-baked base image over Harbor's BaseInstalledAgent**
Harbor installs mini-swe-agent into each task container at runtime (~60s). Pre-baking it into a base image reduces this to ~2s (cached pull). At 25 concurrent containers and hundreds of runs per day, this matters.

**Why Celery over Ray for V1**
Ray is the better long-term foundation for GPU-aware scheduling. But it's complex to operate and overkill for a BYOK-only V1 with a single VM. Celery is simpler, battle-tested, and the migration path to Ray later is straightforward (same task boundaries, different executor).

**Why text-based mode for all runs**
Function-calling mode requires `--enable-auto-tool-choice` on the model server — a flag users serving custom vLLM instances may not have set. Text-based mode (`LitellmTextbasedModel`) works with any OpenAI-compatible endpoint. The tradeoff (slightly more verbose agent outputs) is worth the compatibility guarantee.

**Why accept Harbor task format**
Harbor's task format is growing as a standard for agent benchmarks. There's an existing library of Harbor-format tasks. Accepting it as input means users can bring existing task suites without reformatting.

**Why not store steps in PostgreSQL**
At 20 steps/run × 30 runs/job × many concurrent jobs, step rows pile up fast and are almost never queried individually (only as a full trajectory). Storing trajectory JSONL in R2 and referencing it from the `runs` table is cheaper, faster to write, and easier to stream to the frontend.
