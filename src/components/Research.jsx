import { useState } from "react";
import {
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  BeakerIcon,
  BookOpenIcon,
  ServerStackIcon,
  GlobeAltIcon,
  SparklesIcon,
  ClockIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { researchAreas, statusConfig } from "../data/researchAreas";
import PageHelmet from "./PageHelmet";
import { Link } from "react-router-dom";

/* ─── Artifact icon map ─── */
const artifactMeta = {
  paper: { icon: DocumentTextIcon, label: "Paper" },
  code: { icon: CodeBracketIcon, label: "Code" },
  data: { icon: ServerStackIcon, label: "Data" },
  docs: { icon: BookOpenIcon, label: "Docs" },
  agents: { icon: SparklesIcon, label: "AI Ready" },
};

/* ─── Gather all projects flat ─── */
function allProjects() {
  return researchAreas.flatMap((area) =>
    area.projects.map((p) => ({ ...p, areaId: area.id, areaTitle: area.title }))
  );
}

/* ─── Stats ─── */
function computeStats(projects) {
  const papers = projects.filter((p) => p.artifacts?.paper).length;
  const repos = projects.filter((p) => p.artifacts?.code).length;
  const datasets = projects.filter((p) => p.artifacts?.data).length;
  const live = projects.filter((p) => p.status === "live").length;
  return { papers, repos, datasets, live };
}

/* ─── Status Dot ─── */
function StatusDot({ status, size = "sm" }) {
  const cfg = statusConfig[status];
  if (!cfg) return null;
  const dim = size === "lg" ? "w-3.5 h-3.5" : "w-2.5 h-2.5";
  return (
    <span
      className={`inline-block ${dim} rounded-full ${cfg.dot} shadow-sm`}
    />
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status, size = "sm" }) {
  const cfg = statusConfig[status];
  if (!cfg) return null;
  const s = size === "lg" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${s} ${cfg.color}`}
    >
      <StatusDot status={status} size={size} />
      {cfg.label}
    </span>
  );
}

/* ─── Artifact Pill ─── */
function ArtifactPill({ type, artifact }) {
  const meta = artifactMeta[type];
  if (!meta || !artifact) return null;
  const Icon = meta.icon;
  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-[#A31F34] hover:text-[#A31F34] hover:shadow-md"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{meta.label}</span>
    </a>
  );
}

/* ─── Artifact bar (for card footer) ─── */
function ArtifactBar({ artifacts }) {
  const types = artifacts
    ? Object.keys(artifactMeta).filter((t) => artifacts[t])
    : [];
  if (types.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((t) => (
        <ArtifactPill key={t} type={t} artifact={artifacts[t]} />
      ))}
    </div>
  );
}

/* ─── Featured Spotlight ─── */
function FeaturedSpotlight({ project }) {
  const area = researchAreas.find((a) =>
    a.projects.some((p) => p.id === project.id)
  );
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a1a2e] shadow-xl">
      {/* Decorative accent */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#A31F34] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-green-500 opacity-10 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-10">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <StatusBadge status={project.status} size="lg" />
            {area && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                {area.title}
              </span>
            )}
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white font-serif md:text-3xl">
            {project.title}
          </h2>

          <p className="mb-1 text-base leading-relaxed text-gray-300">
            {project.oneliner}
          </p>

          {project.lastUpdated && (
            <p className="mb-4 flex items-center gap-1.5 text-sm text-gray-400">
              <ClockIcon className="h-4 w-4" />
              Last updated {project.lastUpdated}
            </p>
          )}

          {/* Artifact ribbon */}
          <div className="mt-4">
            <ArtifactBar artifacts={project.artifacts} />
          </div>

          {/* Area context link */}
          <div className="mt-6">
            <a
              href={project.artifacts?.paper?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e85d6e] hover:text-white transition-colors"
            >
              <DocumentTextIcon className="h-4 w-4" />
              {project.artifacts?.paper?.label || "View Paper"}
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Visual badge cluster */}
        <div className="shrink-0">
          <div className="flex flex-wrap gap-3 md:flex-col">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-xs text-gray-400">Artifacts</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold text-green-400">Live</p>
              <p className="text-xs text-gray-400">Status</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, areaTitle }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:border-gray-200 hover:shadow-lg">
      {/* Status bar on top */}
      <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
        </div>
        {project.lastUpdated && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <ClockIcon className="h-3.5 w-3.5" />
            {project.lastUpdated}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {project.image && (
          <div className="relative shrink-0 overflow-hidden md:w-56">
            <div className="h-48 w-full md:h-full">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Gradient overlay on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:bg-gradient-to-r" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded bg-[#A31F34]/5 px-2 py-0.5 text-xs font-medium text-[#A31F34]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="mb-1.5 text-lg font-bold text-gray-900 font-serif group-hover:text-[#A31F34] transition-colors">
            {project.title}
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-gray-600 flex-1">
            {project.description}
          </p>

          {/* Artifacts */}
          <div className="mt-auto">
            <ArtifactBar artifacts={project.artifacts} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Main Component ─── */
function Research() {
  const projects = allProjects();
  const stats = computeStats(projects);
  const spotlight = projects.find((p) => p.highlight);
  const [filter, setFilter] = useState("all");

  const statusFilters = [
    { key: "all", label: "All Projects" },
    { key: "live", label: "Live" },
    { key: "published", label: "Published" },
    { key: "in-progress", label: "In Progress" },
  ];

  const filteredAreas = researchAreas
    .map((area) => ({
      ...area,
      projects:
        filter === "all"
          ? area.projects
          : area.projects.filter((p) => p.status === filter),
    }))
    .filter((area) => area.projects.length > 0);

  return (
    <div>
      <PageHelmet
        title="Research"
        description="Research spanning neuroimaging, reproducibility, and computational social science."
        path="/research"
      />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden bg-gray-900 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#A31F34]/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white font-serif sm:text-5xl">
            Research
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-gray-300">
            I study how the brain processes stories, games, and real-life
            experiences. Every project includes more than a paper: code, data,
            and documentation that let others use what we built.
          </p>

          {/* ─── Stats Strip ─── */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Papers", value: stats.papers, icon: DocumentTextIcon },
              { label: "Repositories", value: stats.repos, icon: CodeBracketIcon },
              { label: "Datasets", value: stats.datasets, icon: ServerStackIcon },
              { label: "Live Projects", value: stats.live, icon: SparklesIcon },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm"
              >
                <stat.icon className="mx-auto mb-1 h-5 w-5 text-gray-400" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* ─── Featured Spotlight ─── */}
        {spotlight && (
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <BeakerIcon className="h-5 w-5 text-[#A31F34]" />
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Featured — Living Project
              </span>
            </div>
            <FeaturedSpotlight project={spotlight} />
          </div>
        )}

        {/* ─── Filter Tabs ─── */}
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
          <FunnelIcon className="mr-1 h-4 w-4 text-gray-400" />
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-[#A31F34] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.key !== "all" && statusConfig[f.key] && (
                <span className="mr-1.5 inline-block">
                  <StatusDot status={f.key} />
                </span>
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* ─── Research Areas ─── */}
        <div className="space-y-14">
          {filteredAreas.map((area) => (
            <section key={area.id}>
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 font-serif">
                  {area.title}
                </h2>
                <p className="max-w-3xl text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>

              <div className="space-y-5">
                {area.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    areaTitle={area.title}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ─── Footer ─── */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-8">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-lg font-medium text-[#A31F34] transition-all hover:underline group"
          >
            View all publications
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/softwares"
            className="inline-flex items-center gap-2 text-lg font-medium text-gray-500 transition-all hover:text-[#A31F34] group"
          >
            Open source tools
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Research;
