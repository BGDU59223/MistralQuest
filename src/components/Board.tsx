import { useState } from "react";
import type { Difficulty, GameState, Status, Task } from "../game/types";
import { DIFFICULTIES, SUBTASK_REWARD } from "../game/data";
import type { Action } from "../game/state";

interface BoardProps {
  state: GameState;
  dispatch: (a: Action) => void;
}

const COLUMNS: { status: Status; label: string; icon: string }[] = [
  { status: "todo", label: "À faire", icon: "📋" },
  { status: "doing", label: "En cours", icon: "⚔️" },
  { status: "done", label: "Terminé", icon: "🏁" },
];

export function Board({ state, dispatch }: BoardProps) {
  const [dragOver, setDragOver] = useState<Status | null>(null);

  return (
    <div className="board-wrap">
      <AddTaskForm dispatch={dispatch} />
      <div className="board">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className={"column" + (dragOver === col.status ? " column-drop" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(col.status);
            }}
            onDragLeave={() => setDragOver((c) => (c === col.status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              const id = e.dataTransfer.getData("text/plain");
              if (id) dispatch({ type: "move-task", id, status: col.status });
            }}
          >
            <div className="column-header">
              <span>{col.icon}</span> {col.label}
              <span className="column-count">
                {state.tasks.filter((t) => t.status === col.status).length}
              </span>
            </div>
            {state.tasks
              .filter((t) => t.status === col.status)
              .map((t) => (
                <TaskCard key={t.id} task={t} dispatch={dispatch} />
              ))}
            {state.tasks.filter((t) => t.status === col.status).length === 0 && (
              <div className="column-empty">— vide —</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, dispatch }: { task: Task; dispatch: (a: Action) => void }) {
  const diff = DIFFICULTIES[task.difficulty];
  const isBoss = task.difficulty === "boss";
  const hp = task.subtasks.length;
  const hpDone = task.subtasks.filter((s) => s.done).length;

  return (
    <div
      className={`task-card ${diff.cls}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
    >
      <div className="task-top">
        <span className="task-diff">
          {diff.icon} {diff.label}
        </span>
        <span className="task-reward">
          +{diff.xp} XP · +{diff.gold}🪙
        </span>
        <button
          className="task-delete"
          title="Supprimer"
          onClick={() => dispatch({ type: "delete-task", id: task.id })}
        >
          ✕
        </button>
      </div>
      <div className="task-title">{task.title}</div>
      {isBoss && (
        <div className="boss-hp">
          <div className="boss-hp-label">
            ☠ PV du boss : {hp - hpDone}/{hp}
          </div>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${hp ? (hpDone / hp) * 100 : 0}%` }} />
          </div>
        </div>
      )}
      {(isBoss || task.subtasks.length > 0) && task.status !== "done" && (
        <div className="subtasks">
          {task.subtasks.map((st) => (
            <label key={st.id} className={"subtask" + (st.done ? " subtask-done" : "")}>
              <input
                type="checkbox"
                checked={st.done}
                onChange={() =>
                  dispatch({ type: "toggle-subtask", taskId: task.id, subtaskId: st.id })
                }
              />
              <span>{st.label}</span>
            </label>
          ))}
          <AddSubtask taskId={task.id} dispatch={dispatch} />
        </div>
      )}
    </div>
  );
}

function AddSubtask({ taskId, dispatch }: { taskId: string; dispatch: (a: Action) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="subtask-add"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          dispatch({ type: "add-subtask", taskId, label: value });
          setValue("");
        }
      }}
    >
      <input value={value} placeholder="+ étape…" onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}

function AddTaskForm({ dispatch }: { dispatch: (a: Action) => void }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("moyenne");
  const [subtasks, setSubtasks] = useState("");

  return (
    <form
      className="add-task panel"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        dispatch({
          type: "add-task",
          title,
          difficulty,
          subtasks: difficulty === "boss" ? subtasks.split("\n") : [],
        });
        setTitle("");
        setSubtasks("");
      }}
    >
      <h3 className="panel-title">➕ Nouvelle tâche</h3>
      <div className="add-task-row">
        <input
          className="add-task-title"
          value={title}
          placeholder="Que faut-il accomplir, héros ?"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="diff-picker">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              className={"diff-btn " + DIFFICULTIES[d].cls + (difficulty === d ? " diff-active" : "")}
              onClick={() => setDifficulty(d)}
            >
              {DIFFICULTIES[d].icon} {DIFFICULTIES[d].label}
              <small>+{DIFFICULTIES[d].xp}xp</small>
            </button>
          ))}
        </div>
      </div>
      {difficulty === "boss" && (
        <div className="boss-hint">
          ☠ Boss détecté ! Une étape par ligne — chaque étape terminée lui inflige des dégâts
          (+{SUBTASK_REWARD.xp} XP) :
          <textarea
            value={subtasks}
            rows={3}
            placeholder={"Rédiger le cahier des charges\nMaquette Figma\nRevue de code"}
            onChange={(e) => setSubtasks(e.target.value)}
          />
        </div>
      )}
      <button className="btn btn-accent" type="submit">
        Ajouter au board
      </button>
    </form>
  );
}
