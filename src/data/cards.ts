export interface CardData {
  id: number;
  title: string;
  part: "sdlc" | "api";
  section: string;
  frontContent: string[];
  backQuestions: string[];
}

export const cards: CardData[] = [
  {
    id: 1,
    title: "Work Items & Traceability",
    part: "sdlc",
    section: "1.1",
    frontContent: [
      "The unit of work is the ticket. Every piece of code change traces back to a ticket; every release reports which tickets it contains. This chain is the load-bearing structure of the entire process — without it, the team cannot answer basic questions about what is in production, why it exists, or when it changed.",
      "Each ticket has a unique identifier — for example, PROJ-1234. That identifier flows through every downstream artifact:",
      "Branches are named with the ticket ID: feat/PROJ-1234-rabbit-backpressure",
      "Pull requests reference the ticket in their description: Closes #1234",
      "Merge commits carry the ticket reference into the git history",
      "Release notes list which tickets were resolved in each release",
      "Tickets close automatically when the release containing them ships to production",
      "Tickets are organized into hierarchy. Epics or milestones group related work; sprints time-box delivery. The hierarchy serves planning and reporting, not execution — the unit of work remains the individual ticket.",
      "Base level recommendation: The four ticket types above, with ticket IDs flowing through branch names, PR descriptions, commits, and release notes. Acceptance criteria mandatory on stories before they are accepted into a sprint. Story-point estimation and velocity tracking are deferred until the team has the size and stability to make those numbers meaningful.",
    ],
    backQuestions: [
      "How will we enforce ticket IDs in branch names and pull requests?",
      "Who is responsible for writing the acceptance criteria before work begins?",
    ],
  },
  {
    id: 2,
    title: "Branching Model",
    part: "sdlc",
    section: "1.2",
    frontContent: [
      "The branching model is determined by the deployment cadence target. Continuous delivery — where any commit to the main branch is a candidate for production — rules out heavyweight models like GitFlow that maintain parallel long-lived branches. The model that fits is trunk-based development, in either its strict form (multiple commits per day directly to main, with feature flags) or its lightweight form (GitHub Flow, with short-lived feature branches that merge to main via pull requests).",
      "The fundamental decision: one source-of-truth branch (main), with environments as deployment targets, not branches.",
      "The correct model: feature branches merge to main via pull request. Each merge to main produces a single built artifact (a container image, identified by both a semantic version tag and the git commit SHA). That same artifact is promoted through environments — dev, staging, production — with environment-specific configuration injected at runtime. The image is identical in every environment; only configuration varies.",
      "This produces a number of properties that matter:",
      "There is one definitive answer to \"what is in production right now\": the image tagged with the latest release version on main.",
      "There is one definitive answer to \"what did QA test\": the same image bits that will deploy to production.",
      "Rollback is trivial: redeploy the previous image tag. No git operations required.",
      "Base level recommendation: GitHub Flow with a discipline of short-lived feature branches (target: under three days). Branch naming follows the pattern type/TICKET-ID-short-slug. Direct pushes to main are prohibited by branch protection.",
    ],
    backQuestions: [
      "What is our deployment cadence target?",
      "Can we commit to keeping feature branches alive for less than three days?",
    ],
  },
  {
    id: 3,
    title: "Issue Lifecycle",
    part: "sdlc",
    section: "1.3",
    frontContent: [
      "An issue moves through a defined set of states from creation to closure. The states are not merely organizational — they correspond to operational states of the code change itself, and the transitions are events that can be automated.",
      "Two ideas in this lifecycle are load-bearing and worth surfacing:",
      "\"Done\" means \"in production,\" not \"merged.\" If \"done\" is defined as \"merged to main,\" then nobody owns the gap between merge and production. Tickets accumulate in a half-shipped state, and the project board diverges from reality. Tying \"done\" to a tagged production release closes that gap and makes the release tag — see section 1.5 — the artifact that actually closes work.",
      "\"Ready\" is a gate, not just a state. A ticket is not pullable simply because it exists. Acceptance criteria, scope, and dependencies must be defined before development begins. Without this gate, developers scope tickets at code-writing time, which is when requirements drift starts. In the absence of a dedicated product manager, the gate is held by Engineering leadership at sprint planning.",
      "Backward transitions matter. \"In Review\" can return to \"In Progress\" when review surfaces required changes. \"In QA\" can return to \"In Progress\" when QA finds a defect. The board reflects this honestly rather than pretending work flows linearly.",
      "Base level recommendation: Adopt the full six-state lifecycle. The \"Ready\" and \"In QA\" gates are aspirational pending dedicated product management and QA roles; in the interim, Engineering leadership approves \"Ready\" during sprint planning, and \"In QA\" is satisfied by automated tests and smoke tests against the staging environment. The lifecycle is encoded in GitHub Projects automation so cards move automatically based on PR and release state, rather than relying on developers to manually update them.",
    ],
    backQuestions: [
      "Who holds the \"Ready\" gate to prevent requirements drift?",
    ],
  },
  {
    id: 4,
    title: "Pull Request Mechanics",
    part: "sdlc",
    section: "1.4",
    frontContent: [
      "The pull request is the unit of code review and the unit of merge. Its quality is determined by two things: scope discipline and review norms. The mechanics that follow are best understood as encoding agreements that the team has to make consciously rather than allowing to evolve by accident.",
      "One PR corresponds to one ticket. This is a strong default rather than an absolute rule, but the rationale is structural: multi-ticket PRs are reviewable in theory and unreviewable in practice.",
      "PR size targets follow from research on review effectiveness: review quality drops sharply above approximately 400 lines of changed code. The team's default target is under 200 lines where possible.",
      "Required approvals. At least one reviewer who is not the author. Critical paths — authentication, payments, data model changes, infrastructure — require two. CODEOWNERS rules in the repository automatically assign reviewers based on which files changed.",
      "Squash-merge by default: one commit per PR on main, clean history, the PR title becomes the squash commit message.",
      "PR title follows Conventional Commits format (see section 1.5), validated by CI.",
      "The author merges their own PR after approval, not the reviewer — the author owns the timing of the merge.",
      "Base level recommendation: PR template requiring ticket link. One required reviewer. CODEOWNERS for any critical paths identified. Squash-merge with Conventional Commits PR titles. Branch protection on main: required status checks, required reviews, no force push, no direct push.",
    ],
    backQuestions: [
      "What are our critical paths that will always require two reviewers?",
    ],
  },
  {
    id: 5,
    title: "Releases & Versioning",
    part: "sdlc",
    section: "1.5",
    frontContent: [
      "A release is not \"whatever happens to be on main this week.\" It is an explicit, versioned bundle of tickets, tagged at a specific commit, reproducible, and traceable. The release tag is the artifact that ties together everything the SDLC produces: the resolved tickets, the built image, the deployed environments, and the consumer-facing documentation.",
      "Releases follow semantic versioning: MAJOR.MINOR.PATCH. The version is computed automatically from the commit history since the previous release tag, using Conventional Commits to determine the bump:",
      "fix: commits bump the patch version.",
      "feat: commits bump the minor version.",
      "feat! or BREAKING CHANGE: footer bumps the major version.",
      "Conventional Commits is load-bearing in this proposal. If commits are not formatted correctly, version computation breaks and release notes degrade to noise.",
      "Releases are created by automation. The team does not hand-craft tags, version numbers, or release notes.",
      "Release tags as the unit of QA truth: QA cannot test \"the current state of main\" — that state moves under them. They can test \"release v2.7.4,\" because the tag is immutable and is bound to a known set of tickets via the release notes.",
      "Base level recommendation: Time-boxed releases at the end of each two-week sprint, created via manual workflow dispatch. release-please for automation. Conventional Commits enforced via commitlint on PR titles. Images tagged with both semver and SHA. Migration to continuous release is a stated target, contingent on observability investment.",
    ],
    backQuestions: [
      "Are we starting with time-boxed sprint releases or moving directly to continuous releases?",
    ],
  },
  {
    id: 6,
    title: "Environments & Configuration",
    part: "sdlc",
    section: "1.6",
    frontContent: [
      "Three environments are the minimum that makes the pipeline meaningful: development, staging, and production. Each runs the same container image, with environment-specific configuration injected at runtime.",
      "What varies between environments is configuration: database connection strings, feature flag values, scaling parameters, external service endpoints. These are externalized — they live in Azure App Configuration and Azure Key Vault, not in the image. The image cannot know which environment it is running in, and that is the correct property: it forces a clean separation of code from configuration.",
      "This produces the property that what QA tested in staging is what gets promoted to production. Not \"the same code, built differently.\" The same bits.",
      "Configuration in three layers: Static configuration (values that vary by environment but do not change at runtime), Secrets (sensitive values — credentials, API keys, certificates), and Feature flags (values that change at runtime without redeploying).",
      "These three problems require three different tools because they have different access patterns and different lifecycles. Conflating them is the source of a substantial fraction of production incidents.",
      "Feature flags are the foundation that makes trunk-based development viable. They decouple deployment from release: code can ship to production behind a flag in the off position, then be activated later.",
      "Flags accumulate debt. Each one is a code path that exists, must be maintained, and adds cognitive load. To prevent debt accumulation, flags are categorized and managed differently by category.",
      "Base level recommendation: Three environments (dev, staging, prod). Same container image in each. Static config in Azure App Configuration. Secrets in Azure Key Vault, accessed via Managed Identity. Feature flags in Azure App Configuration. Flag taxonomy enforced via naming conventions and PR review.",
    ],
    backQuestions: [
      "How will we categorize and audit feature flags to prevent technical debt?",
    ],
  },
  {
    id: 7,
    title: "CI/CD Pipeline",
    part: "sdlc",
    section: "1.7",
    frontContent: [
      "The pipeline is the load-bearing artifact of this proposal. Every concept described elsewhere — issue lifecycle, branching, PR mechanics, release management, environment promotion — depends on the pipeline enforcing it. A process described in a wiki but not encoded in pipeline configuration degrades to vibes within a quarter. The YAML is the contract.",
      "The pipeline is organized in three phases: PR pipeline (runs on every push to a feature branch with an open PR — validate the change in isolation before merge), Main pipeline (runs on merge to main — produce the deployable artifact, deploy to dev and staging, validate), and Release pipeline (runs on release tag creation — promote the validated artifact to production).",
      "Each phase is composed of stages. Each stage is a gate that can fail and stop progression. Stages are ordered by cost and scope: cheap, fast, isolated checks run first; expensive, slow, deployment-dependent checks run later.",
      "Total wall-clock time target: under eight minutes for the full PR pipeline. Beyond ten minutes, the pipeline becomes a context-switch cost rather than a feedback loop.",
      "Required (blocks merge or promotion): All build, lint, format jobs. Unit and integration tests. Critical security findings. Breaking change detection on API specs. Commit message format. Smoke tests at each environment.",
      "Advisory (reported, does not block): Code complexity and duplication findings. Low-severity CVEs. Non-critical static analysis findings.",
      "The advisory category is load-bearing. It lets the team see signals without being held hostage by them.",
      "Base level recommendation: All three phases implemented. Phase 1 includes lint, build, unit tests, dependency scan, integration tests, commitlint as required gates. Phase 2 includes image build, image scan, deploy to dev with smoke tests. Phase 3 includes manual approval, deploy to prod, post-deploy smoke tests, ticket closure, documentation publication.",
    ],
    backQuestions: [
      "Which checks must actively block a merge versus acting as advisory warnings?",
    ],
  },
  {
    id: 8,
    title: "Hotfix Flow",
    part: "sdlc",
    section: "1.8",
    frontContent: [
      "A hotfix is not a category of code; it is a category of urgency. The code change itself may be a one-line null check. What makes it a hotfix is operational context: production is degraded or broken, and the standard release cadence is too slow to address it.",
      "This distinction matters because the temptation is to invent a separate process for hotfixes — different branches, different review rules, different deploy paths. That is almost always the wrong response. The right response is the same process executed faster.",
      "Response A — forward-fix from main. Fix the bug on main via the normal flow. When main is in a releasable state, cut a new release and promote it to production. This works only if main is consistently releasable, which requires feature flag discipline.",
      "Response B — hotfix branch from the release tag. Branch from the production release tag, apply the surgical fix, build and deploy that branch as a new patch release. The fix is also merged into main so it is not lost in the next normal release.",
      "Policy: Default to Response A (forward-fix). Fall back to Response B when main is not in a releasable state. Track the ratio of B to A — frequent use of B is a signal that main hygiene has degraded.",
      "The emergency bypass: a separate workflow with manual dispatch only, requiring named approval (Director or above), deploying a specified image SHA directly to production. The image must still have been built from a real commit. What is bypassed is environment promotion, not CI.",
      "Every invocation is logged in an incident channel and post-mortemed within a week. The bypass must be a blameless, legitimate option.",
      "Base level recommendation: Default to forward-fix; document both responses and their decision criteria. Emergency bypass implemented as a manually-dispatched workflow with named-approver gating. Hotfix frequency tracked as a process health metric. No skipping of CI under any path.",
    ],
    backQuestions: [
      "Under what conditions do we use the emergency bypass, and who is the named approver?",
    ],
  },
  {
    id: 9,
    title: "Versioning Strategy",
    part: "api",
    section: "2.1 & 2.2",
    frontContent: [
      "Two versions live in any API product, and conflating them produces durable confusion:",
      "Release version (for example, 2.7.4): Identifies a deployed artifact. Internal concern. Changes constantly. Tied to commits.",
      "API version (for example, v1): Identifies a consumer-facing contract. External concern. Changes rarely. Tied only to breaking changes.",
      "A single service running release 2.7.4 might simultaneously serve /api/v1/ and /api/v2/ endpoints. Different lifecycles, different audiences, different rules.",
      "Three strategies for exposing API versions are technically viable: URI path versioning (/api/v1/resource), query parameter versioning (?api-version=1), and header versioning (Accept: application/vnd.api.v1+json).",
      "Recommendation: URI path versioning. The arguments against it tend to be aesthetic (\"REST purity\"); the operational arguments for it are concrete. Path versioning shows up in logs, in client code, in routing rules, in cache keys. Consumers expect it. Azure API Management routes it cleanly. It is the version strategy least likely to cause operational confusion.",
    ],
    backQuestions: [
      "Are we culturally committed to never breaking a published contract once it ships?",
    ],
  },
  {
    id: 10,
    title: "Breaking Changes & Documentation",
    part: "api",
    section: "2.3, 2.4 & 2.5",
    frontContent: [
      "Breaking-change detection is the technical control that enforces the API versioning policy. The team needs an explicit, written contract about what counts as breaking, because the alternative is reviewer judgment, which decays over time.",
      "Breaking: Removing a field. Renaming a field. Changing a field's type. Tightening validation. Changing error codes. Changing authentication semantics. Adding a required field to a request body.",
      "Not breaking: Adding an optional field to a request. Adding a new field to a response. Adding a new endpoint. Loosening validation. Adding new optional query parameters.",
      "Every published API version has a lifecycle with defined phases. The phases are calendar events, not vibes. Major versions: three years of GA, followed by a defined migration period. Minor versions within a major: backward-compatible by definition.",
      "For every release of every supported API version, the OpenAPI specification is published as a versioned, hosted, browsable artifact. Consumers can browse the current API contract interactively, pin to a specific release's documentation, diff between versions to see what changed, and download the raw spec to generate clients.",
      "Spec-first authoring is the corollary discipline. The OpenAPI specification is checked into the repository, reviewed in PRs, and is the source of truth. Code implements the spec; runtime validation enforces conformance.",
      "Base level recommendation: URI path versioning. Spec-first OpenAPI authoring with runtime conformance validation. openapi-diff in PR pipeline as the breaking-change gate. Three-phase lifecycle (GA, Maintenance, Retired) with default windows of three years major / one year minor support. Hosted documentation as a static site organized by API version and release version.",
    ],
    backQuestions: [
      "What is our official support window for major and minor API versions before they are retired?",
    ],
  },
];
