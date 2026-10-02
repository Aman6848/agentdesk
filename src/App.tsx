import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleStop,
  Clock3,
  FolderGit2,
  GitBranch,
  Play,
  Plus,
  Search,
  Settings2,
  TerminalSquare,
  X,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Status = "Running" | "Waiting" | "Completed" | "Stopped";
type Agent = {
  id: number;
  name: string;
  provider: "Claude" | "Codex" | "Gemini";
  project: string;
  task: string;
  status: Status;
  duration: string;
  branch: string;
  output: string[];
};

const seedAgents: Agent[] = [
  {
    id: 1,
    name: "Payment API",
    provider: "Claude",
    project: "backend",
    task: "Implement payment webhook",
    status: "Running",
    duration: "12m",
    branch: "agent/payment-webhook",
    output: [
      "$ claude",
      "AgentDesk session connected.",
      "> Implement payment webhook",
      "✓ Inspecting existing payment service...",
      "✓ Found webhook controller and event model.",
      "→ Writing idempotency handling...",
      "▋"
    ]
  },
  {
    id: 2,
    name: "Authentication",
    provider: "Codex",
    project: "backend",
    task: "Refactor JWT middleware",
    status: "Running",
    duration: "8m",
    branch: "agent/jwt-refactor",
    output: [
      "$ codex",
      "> Refactor JWT middleware",
      "✓ Reading auth middleware...",
      "✓ 14 tests discovered.",
      "→ Updating token validation flow...",
      "▋"
    ]
  },
  {
    id: 3,
    name: "Test Suite",
    provider: "Gemini",
    project: "frontend",
    task: "Add missing integration tests",
    status: "Waiting",
    duration: "21m",
    branch: "agent/integration-tests",
    output: [
      "$ gemini",
      "> Add missing integration tests",
      "✓ Test plan generated.",
      "⚠ Waiting for confirmation before modifying fixtures.",
      "▋"
    ]
  }
];

const projects = [
  { name: "backend", count: 2 },
  { name: "frontend", count: 1 },
  { name: "infra", count: 0 }
];

function App() {
  const [agents, setAgents] = useState(seedAgents);
  const [selectedId, setSelectedId] = useState(1);
  const [projectFilter, setProjectFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTask, setNewTask] = useState("Review the repository and propose improvements");
  const [newProvider, setNewProvider] = useState<Agent["provider"]>("Claude");

  const selected = agents.find((agent) => agent.id === selectedId) ?? agents[0];

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchesProject = projectFilter === "all" || agent.project === projectFilter;
      const matchesSearch =
        !query ||
        [agent.name, agent.provider, agent.project, agent.task, agent.branch]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesProject && matchesSearch;
    });
  }, [agents, projectFilter, search]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAgents((current) =>
        current.map((agent) =>
          agent.status === "Running" && Math.random() > 0.72
            ? {
                ...agent,
                duration: agent.duration === "now" ? "1m" : agent.duration,
                output: agent.output.some((line) => line.includes("✓ Changes ready"))
                  ? agent.output
                  : [...agent.output.slice(0, -1), "✓ Changes ready for review.", "▋"]
              }
            : agent
        )
      );
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const createAgent = () => {
    const id = Math.max(...agents.map((agent) => agent.id), 0) + 1;
    const project = projectFilter === "all" ? "backend" : projectFilter;
    const agent: Agent = {
      id,
      name: `${newProvider} Session ${id}`,
      provider: newProvider,
      project,
      task: newTask,
      status: "Running",
      duration: "now",
      branch: `agent/session-${id}`,
      output: [
        `$ ${newProvider.toLowerCase()}`,
        "AgentDesk session started.",
        `> ${newTask}`,
        "→ Preparing isolated workspace...",
        "▋"
      ]
    };
    setAgents((current) => [...current, agent]);
    setSelectedId(id);
    setShowNew(false);
  };

  const stopSelected = () => {
    if (!selected) return;
    setAgents((current) =>
      current.map((agent) =>
        agent.id === selected.id
          ? { ...agent, status: "Stopped", output: [...agent.output.slice(0, -1), "■ Session stopped."] }
          : agent
      )
    );
  };

  const resumeSelected = () => {
    if (!selected) return;
    setAgents((current) =>
      current.map((agent) =>
        agent.id === selected.id
          ? { ...agent, status: "Running", output: [...agent.output.slice(0, -1), "→ Session resumed...", "▋"] }
          : agent
      )
    );
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Bot size={18} /></div>
          <div>
            <div className="brand-name">AgentDesk</div>
            <div className="brand-subtitle">Mission control</div>
          </div>
          <span className="demo-badge">DEMO</span>
        </div>

        <button className="new-agent" onClick={() => setShowNew(true)}>
          <Plus size={16} />
          New Agent
        </button>

        <section className="nav-section">
          <div className="section-label">Projects</div>
          <button className={`project ${projectFilter === "all" ? "active" : ""}`} onClick={() => setProjectFilter("all")}>
            <Activity size={16} /> All agents <span>{agents.length}</span>
          </button>
          {projects.map((project) => (
            <button
              key={project.name}
              className={`project ${projectFilter === project.name ? "active" : ""}`}
              onClick={() => setProjectFilter(project.name)}
            >
              <FolderGit2 size={16} /> {project.name} <span>{agents.filter((a) => a.project === project.name).length}</span>
            </button>
          ))}
        </section>

        <div className="sidebar-footer">
          <button className="footer-button"><Activity size={16} /> Activity</button>
          <button className="footer-button"><Settings2 size={16} /> Settings</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">Workspace / Agent fleet</div>
            <h1>Active Agents</h1>
          </div>
          <div className="topbar-actions">
            <div className="search">
              <Search size={14} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search agents..." />
              <kbd>⌘ K</kbd>
            </div>
            <div className="agent-count">{agents.length} sessions</div>
          </div>
        </header>

        <div className="content">
          <div className="fleet-header">
            <div>
              <span className="live-dot" /> Fleet status
            </div>
            <div className="fleet-stats">
              <span><Zap size={13} /> {agents.filter((a) => a.status === "Running").length} running</span>
              <span><Clock3 size={13} /> {agents.filter((a) => a.status === "Waiting").length} waiting</span>
            </div>
          </div>

          <div className="agent-grid">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                className={`agent-card ${agent.id === selectedId ? "selected" : ""}`}
                onClick={() => setSelectedId(agent.id)}
              >
                <div className="agent-card-top">
                  <span className={`status-dot ${agent.status.toLowerCase()}`} />
                  <span className="provider">{agent.provider}</span>
                  <span className="duration">{agent.duration}</span>
                </div>
                <div className="agent-name">{agent.name}</div>
                <div className="agent-task">{agent.task}</div>
                <div className="agent-card-footer">
                  <span><FolderGit2 size={12} /> {agent.project}</span>
                  <span><GitBranch size={12} /> {agent.branch.replace("agent/", "")}</span>
                </div>
              </button>
            ))}
            {filteredAgents.length === 0 && (
              <div className="empty-state">No agents match the current filter.</div>
            )}
          </div>

          {selected && (
            <section className="terminal-panel">
              <div className="terminal-header">
                <div className="terminal-title">
                  <TerminalSquare size={16} />
                  <strong>{selected.name}</strong>
                  <span className="terminal-meta">~/projects/{selected.project}</span>
                  <span className="branch-pill"><GitBranch size={11} /> {selected.branch}</span>
                </div>
                <div className="terminal-actions">
                  <span className={`status-pill ${selected.status.toLowerCase()}`}>{selected.status}</span>
                  {selected.status === "Stopped" ? (
                    <button className="icon-button" title="Resume" onClick={resumeSelected}><Play size={14} /></button>
                  ) : (
                    <button className="icon-button danger" title="Stop" onClick={stopSelected}><CircleStop size={14} /></button>
                  )}
                </div>
              </div>
              <div className="terminal-body">
                {selected.output.map((line, index) => (
                  <div key={index} className={line.startsWith("✓") ? "success-line" : line.startsWith("⚠") ? "warning-line" : line.startsWith("→") ? "action-line" : ""}>
                    {line}
                  </div>
                ))}
              </div>
              <div className="terminal-input">
                <span>›</span>
                <input placeholder="Send a command or instruction..." onKeyDown={(event) => {
                  if (event.key === "Enter" && event.currentTarget.value.trim()) {
                    const value = event.currentTarget.value.trim();
                    setAgents((current) => current.map((agent) =>
                      agent.id === selected.id
                        ? { ...agent, output: [...agent.output.slice(0, -1), `$ ${value}`, "→ Agent is processing...", "▋"] }
                        : agent
                    ));
                    event.currentTarget.value = "";
                  }
                }} />
              </div>
            </section>
          )}

          <div className="architecture-strip">
            <div><CheckCircle2 size={15} /> Session isolation</div>
            <div><CheckCircle2 size={15} /> Project-aware agents</div>
            <div><CheckCircle2 size={15} /> Provider agnostic</div>
            <div><ChevronRight size={15} /> Git worktrees next</div>
          </div>
        </div>
      </section>

      {showNew && (
        <div className="modal-backdrop" onMouseDown={() => setShowNew(false)}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="eyebrow">Create session</div>
                <h2>New Agent</h2>
              </div>
              <button className="icon-button" onClick={() => setShowNew(false)}><X size={16} /></button>
            </div>
            <label>Provider
              <select value={newProvider} onChange={(event) => setNewProvider(event.target.value as Agent["provider"])}>
                <option>Claude</option>
                <option>Codex</option>
                <option>Gemini</option>
              </select>
            </label>
            <label>Task
              <textarea value={newTask} onChange={(event) => setNewTask(event.target.value)} rows={4} />
            </label>
            <div className="modal-note"><GitBranch size={14} /> Demo mode will simulate an isolated agent session.</div>
            <button className="create-button" onClick={createAgent}><Play size={15} /> Launch Agent</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
