import { Activity, Bot, FolderGit2, Plus, Settings2, TerminalSquare } from "lucide-react";
import { useState } from "react";

type Agent = {
  id: number;
  name: string;
  provider: string;
  project: string;
  task: string;
  status: "Running" | "Waiting" | "Completed";
  duration: string;
};

const initialAgents: Agent[] = [
  {
    id: 1,
    name: "Payment API",
    provider: "Claude",
    project: "backend",
    task: "Implement payment webhook",
    status: "Running",
    duration: "12m"
  },
  {
    id: 2,
    name: "Authentication",
    provider: "Codex",
    project: "backend",
    task: "Refactor JWT middleware",
    status: "Running",
    duration: "8m"
  },
  {
    id: 3,
    name: "Test Suite",
    provider: "Gemini",
    project: "frontend",
    task: "Add missing integration tests",
    status: "Waiting",
    duration: "21m"
  }
];

function App() {
  const [agents, setAgents] = useState(initialAgents);
  const [selectedId, setSelectedId] = useState(1);

  const selected = agents.find((agent) => agent.id === selectedId) ?? agents[0];

  const createAgent = () => {
    const id = Math.max(...agents.map((agent) => agent.id), 0) + 1;
    const agent: Agent = {
      id,
      name: "New Agent",
      provider: "Claude",
      project: "backend",
      task: "Ready for a task",
      status: "Running",
      duration: "now"
    };
    setAgents((current) => [...current, agent]);
    setSelectedId(id);
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
        </div>

        <button className="new-agent" onClick={createAgent}>
          <Plus size={16} />
          New Agent
        </button>

        <section className="nav-section">
          <div className="section-label">Projects</div>
          <button className="project active"><FolderGit2 size={16} /> backend <span>2</span></button>
          <button className="project"><FolderGit2 size={16} /> frontend <span>1</span></button>
          <button className="project"><FolderGit2 size={16} /> infra</button>
        </section>

        <div className="sidebar-footer">
          <button className="footer-button"><Activity size={16} /> Activity</button>
          <button className="footer-button"><Settings2 size={16} /> Settings</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">Workspace</div>
            <h1>Active Agents</h1>
          </div>
          <div className="agent-count">{agents.length} agents</div>
        </header>

        <div className="content">
          <div className="agent-grid">
            {agents.map((agent) => (
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
                <div className="agent-project">{agent.project}</div>
              </button>
            ))}
          </div>

          {selected && (
            <section className="terminal-panel">
              <div className="terminal-header">
                <div>
                  <TerminalSquare size={16} />
                  <span>{selected.name}</span>
                  <span className="terminal-meta">~/projects/{selected.project}</span>
                </div>
                <span className={`status-pill ${selected.status.toLowerCase()}`}>{selected.status}</span>
              </div>
              <div className="terminal-body">
                <div><span className="muted">$</span> claude</div>
                <div className="muted">AgentDesk session started.</div>
                <div><span className="prompt">&gt;</span> {selected.task}</div>
                <div className="muted">Working in isolated session...</div>
                <div className="cursor">▋</div>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
