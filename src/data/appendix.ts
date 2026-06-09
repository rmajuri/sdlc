export interface TableData {
  type: "table";
  headers: string[];
  rows: string[][];
}

export interface CodeBlock {
  type: "code";
  content: string;
}

export type AppendixContentItem = string | TableData | CodeBlock;

export interface AppendixSection {
  id: string;
  title: string;
  content: AppendixContentItem[];
}

export const appendixIntro =
  "This appendix provides concrete tooling choices, pipeline structure, and Azure resource recommendations for greenfield implementation. The recommendations assume a small initial pilot team with the goal of demonstrating the process end-to-end on a single product before generalizing.";

export const appendixSections: AppendixSection[] = [
  {
    id: "3.1",
    title: "3.1 Repository Structure",
    content: [
      "Pipeline configuration lives in the repository alongside the code it builds. Workflows are organized by trigger context, with reusable workflow components extracted to avoid duplication.",
      {
        type: "code",
        content: `.github/
  workflows/
    pr.yml              # Phase 1: pull_request triggers
    main.yml            # Phase 2: push to main
    release.yml         # Phase 3: release tag creation
    release-please.yml  # Tag creation via PR-based flow
    emergency-deploy.yml # Bypass path, workflow_dispatch only
    _reusable-ci.yml    # Shared CI stages (workflow_call)
  CODEOWNERS
  pull_request_template.md
  ISSUE_TEMPLATE/
    bug.md
    story.md
    task.md`,
      },
      "API specifications live in a known location:",
      {
        type: "code",
        content: `openapi/
  v1.yaml             # Current spec for /api/v1/
  v2.yaml             # Current spec for /api/v2/
  history/
    v1-2.7.3.yaml     # Archived release snapshots`,
      },
      "Application configuration lives in a manifest synced to Azure App Configuration:",
      {
        type: "code",
        content: `config/
  defaults.yaml       # Schema and defaults
  dev.yaml            # Per-environment overrides
  staging.yaml
  prod.yaml`,
      },
    ],
  },
  {
    id: "3.2",
    title: "3.2 Tooling Choices",
    content: [
      {
        type: "table",
        headers: ["Function", "Tool", "Rationale"],
        rows: [
          [
            "Source hosting",
            "GitHub",
            "Pre-decided constraint. Native CI/CD integration via Actions.",
          ],
          [
            "CI/CD",
            "GitHub Actions",
            "Native to GitHub; first-class support for OIDC federation to Azure.",
          ],
          [
            "Container registry",
            "Azure Container Registry",
            "Native Azure integration; supports image signing and scanning.",
          ],
          [
            "Compute",
            "Azure Container Apps",
            "Greenfield default. Less operational overhead than AKS; native config and secret injection.",
          ],
          [
            "Static config",
            "Azure App Configuration",
            "Native Azure service; supports environment labels and feature flags as one service.",
          ],
          [
            "Secrets",
            "Azure Key Vault",
            "Native Azure service; integrates with Managed Identity for credential-free access.",
          ],
          [
            "Feature flags",
            "Azure App Configuration (built-in)",
            "Sufficient for pilot. Migrate to LaunchDarkly if targeting requirements outgrow native flags.",
          ],
          [
            "Release automation",
            "release-please",
            "GitHub-native; PR-based flow integrates cleanly with branch protection.",
          ],
          [
            "Commit lint",
            "commitlint (Conventional Commits)",
            "Industry standard; integrates with release-please.",
          ],
          [
            "Static analysis",
            "SonarCloud or CodeQL",
            "SonarCloud for broad code quality; CodeQL for security-focused analysis.",
          ],
          [
            "Dependency scan",
            "Dependabot + npm audit / dotnet vulnerable",
            "Native GitHub features; no additional cost.",
          ],
          [
            "Image scan",
            "Trivy or Microsoft Defender for Containers",
            "Trivy is free and runs in CI; Defender is paid but integrates with Azure-native observability.",
          ],
          [
            "Breaking-change detection",
            "openapi-diff",
            "Established tool, scriptable, runs as a CI step.",
          ],
          [
            "E2E testing",
            "Playwright",
            "Microsoft-supported, cross-browser, good TypeScript ergonomics.",
          ],
          [
            "API gateway (future)",
            "Azure API Management",
            "For consumer-facing API products with subscription, throttling, and developer portal needs.",
          ],
        ],
      },
    ],
  },
  {
    id: "3.3",
    title: "3.3 Azure Resource Architecture",
    content: [
      "Greenfield Azure deployment for a single service. Resources are organized into a resource group per environment to provide isolation and clean teardown.",
      "Resource group per environment: rg-product-dev, rg-product-staging, rg-product-prod.",
      "Container Apps Environment per resource group, with a single Container App per service.",
      "Azure Container Registry shared across environments (one ACR; images are immutable and identified by tag).",
      "Azure App Configuration shared across environments, with environment labels (\"dev\", \"staging\", \"prod\") differentiating values.",
      "Azure Key Vault per environment (secrets are environment-specific by definition; do not share).",
      "Managed Identity assigned to each Container App, with Key Vault Secrets User role on its environment's Key Vault and App Configuration Data Reader on App Configuration.",
      "Log Analytics workspace per environment, ingesting Container Apps logs and metrics.",
      "Application Insights per environment for distributed tracing and structured telemetry.",
      "Azure Storage account + Front Door for hosted API documentation (single instance, multi-region distribution via Front Door).",
    ],
  },
  {
    id: "3.4",
    title: "3.4 Authentication and Identity",
    content: [
      "Service-to-service authentication uses Managed Identity throughout. No static credentials are stored anywhere in the system. The pattern:",
      "Container Apps runs with a System-Assigned or User-Assigned Managed Identity.",
      "That identity is granted least-privilege RBAC on the resources it accesses (Key Vault, App Configuration, Storage, ACR).",
      "Application code uses the Azure SDK's DefaultAzureCredential, which automatically picks up the managed identity in cloud environments and falls back to developer credentials locally.",
      "GitHub Actions authenticates to Azure via OIDC federation, not stored service principal credentials. The workflow assumes a federated identity that is scoped to a specific repository and branch.",
    ],
  },
  {
    id: "3.5",
    title: "3.5 Pipeline Cost Considerations",
    content: [
      "GitHub Actions pricing scales with build minutes. A well-optimized PR pipeline costs cents per run; an unoptimized one can cost dollars. The cost-relevant decisions:",
      "Cache aggressively: npm, NuGet, .NET build outputs, Docker layer cache. Most stages should be cache-hits on iteration.",
      "Parallelize where dependencies permit. The pipeline DAG should be as flat as possible.",
      "Differentiate draft from ready-for-review PRs. Run fast stages (lint, build, unit tests) on draft; defer expensive stages (integration, E2E) until ready.",
      "Self-host runners for high-volume or specialized workloads. Container Apps Jobs or AKS-hosted runners are options once GitHub-hosted runners become a bottleneck.",
      "Expected order of magnitude: for a healthy pipeline running on GitHub-hosted runners, costs are typically in the range of $5-$25 per active developer per month, depending on PR throughput and test suite size. This is a small fraction of developer time saved, but worth budgeting for visibility.",
    ],
  },
  {
    id: "3.6",
    title: "3.6 Adoption Phasing",
    content: [
      "The full process described in this document is the target state. Adoption proceeds in phases:",
      "Phase 0 — baseline (week 1): Ticket taxonomy, branch naming convention, PR template, Conventional Commits, branch protection on main. No code shipped yet; the process scaffolding is in place.",
      "Phase 1 — CI pipeline (weeks 2-3): PR pipeline with lint, build, unit tests, dependency scan, commitlint. Image build on main merge. Deploy to dev environment automatically.",
      "Phase 2 — environment promotion (weeks 3-4): Staging environment added. Main pipeline extended to promote through staging. Manual production deploys via GitHub Actions workflow dispatch.",
      "Phase 3 — release automation (week 5): release-please integrated. Semantic versioning automated. Release notes auto-generated. Manual approval gate on production.",
      "Phase 4 — API product layer (weeks 6-8): OpenAPI spec-first authoring. Breaking-change detection in CI. Hosted documentation site. Lifecycle policy documented and published.",
      "Phase 5 — observability and rollback (ongoing): Application Insights instrumentation. SLO definition. Progressive rollout configuration. Automated rollback on metric breach. Removal of manual production approval gate (transition to true continuous deployment).",
      "Phases 0 through 3 can be completed in roughly a month with focused effort and a small team. Phase 4 depends on having an API product to apply it to; for pre-API services, it is deferred. Phase 5 is open-ended and depends on observability maturity.",
    ],
  },
  {
    id: "3.7",
    title: "3.7 What This Proposal Does Not Solve",
    content: [
      "Honesty about scope:",
      "Organizational structure. This proposal assumes the team has the roles to operate it: developers who write code, reviewers who review PRs, someone who scopes tickets, someone who approves production deploys. Where those roles do not exist organizationally, the proposal flags interim accommodations but does not invent the roles.",
      "Cultural commitment. The discipline that makes this process work — small PRs, timely reviews, honest acceptance criteria, not breaking published API contracts — is cultural. The mechanics encode the discipline but cannot create it. Leadership air cover is required, particularly in the moments when expediency argues against the process.",
      "Specific technology choices for the product being built. The proposal addresses the SDLC and API product layers, which are largely orthogonal to the specific technology stack. Decisions like language, framework, persistence layer, and messaging infrastructure are product decisions that are out of scope here.",
      "Migration of existing services. The greenfield assumption simplifies the proposal substantially. Adapting existing services on OpenShift to this model is a separate project, with its own scoping and tradeoffs.",
    ],
  },
  {
    id: "3.8",
    title: "3.8 Summary of Recommendations",
    content: [
      "Consolidated for reference:",
      {
        type: "table",
        headers: ["Area", "Base-Level Recommendation"],
        rows: [
          [
            "Work items",
            "Story / Bug / Task / Spike. Ticket ID flows through branches, PRs, commits, releases. Acceptance criteria required on stories.",
          ],
          [
            "Branching",
            "GitHub Flow. Short-lived feature branches. Single trunk (main). Environments as deployment targets, not branches.",
          ],
          [
            "Issue lifecycle",
            'Backlog → Ready → In Progress → In Review → In QA → Done. "Done" means in production.',
          ],
          [
            "PRs",
            "One PR per ticket. Under 400 lines target. One required reviewer. Squash-merge with Conventional Commits PR titles. 1-business-day review SLA.",
          ],
          [
            "Releases",
            "Time-boxed end-of-sprint, manually triggered. release-please automates versioning and notes. Migration to continuous on observability readiness.",
          ],
          [
            "Environments",
            "Three (dev, staging, prod). Same image in each. Config in App Configuration, secrets in Key Vault, flags in App Configuration.",
          ],
          [
            "Pipeline",
            "Three phases (PR, main, release). Required vs. advisory vs. informational gates. Manual approval on production during pilot.",
          ],
          [
            "Hotfixes",
            "Default to forward-fix from main. Hotfix branch as fallback when main is not releasable. Emergency bypass available with named approval.",
          ],
          [
            "API versioning",
            "URI path versioning. Spec-first OpenAPI. Breaking-change detection in CI. Three-year major / one-year minor lifecycle.",
          ],
          [
            "API docs",
            "Static site on Azure Storage + Front Door. Per-API-version, per-release-version structure. Published as part of release pipeline.",
          ],
        ],
      },
      "The architecture described here is conventional. None of the individual components are novel; they are the patterns that the industry has converged on for cloud-native software delivery. The contribution of this proposal is not invention but assembly — taking these well-understood pieces and committing to how they fit together for our context.",
      "Adoption is the harder problem than design. The mechanics are buildable in weeks; the cultural commitment to the process — to small PRs, honest acceptance criteria, treating published API contracts as inviolable — is the work of quarters. Both are necessary. This document attempts to make both visible.",
    ],
  },
];
