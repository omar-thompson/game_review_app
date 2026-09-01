import { useEffect, useState } from "react";
import { userApi } from "../utils/api";

// ─── Admin: manage users ────────────────────────────────────────────────────────
export default function AdminUsersPage({ currentUserId, onBack }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "gamer" });
  const [busyId, setBusyId] = useState(null);

  function loadUsers() {
    userApi
      .list()
      .then(setUsers)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function startEdit(user) {
    setEditingId(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setError("");
  }

  async function saveEdit(id) {
    setBusyId(id);
    setError("");
    try {
      const updated = await userApi.update(id, editForm);
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this user? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await userApi.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>Manage Users</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
            View, edit, and remove user accounts
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} className="px-4 py-2 rounded text-sm font-semibold"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}>
            ← Back
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs mb-4 px-3 py-2 rounded border text-red-400"
          style={{ borderColor: "var(--border)", background: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          {error}
        </p>
      )}

      {users === null ? (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No users found.</p>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ background: "var(--muted)" }}>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider" style={{ color: "var(--muted-foreground)" }}>Name</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider" style={{ color: "var(--muted-foreground)" }}>Email</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider" style={{ color: "var(--muted-foreground)" }}>Role</th>
                <th className="px-4 py-3 font-semibold uppercase text-xs tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isEditing = editingId === user._id;
                const isSelf = user._id === currentUserId;
                const isBusy = busyId === user._id;
                return (
                  <tr key={user._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-2 py-1.5 rounded border text-sm outline-none"
                            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                        </td>
                        <td className="px-4 py-2">
                          <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-2 py-1.5 rounded border text-sm outline-none"
                            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                        </td>
                        <td className="px-4 py-2">
                          <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="w-full px-2 py-1.5 rounded border text-sm outline-none"
                            style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                            <option value="gamer">gamer</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          <button onClick={() => saveEdit(user._id)} disabled={isBusy}
                            className="px-3 py-1.5 rounded text-xs font-semibold mr-2 disabled:opacity-50"
                            style={{ background: "var(--primary)", color: "white" }}>
                            {isBusy ? "Saving…" : "Save"}
                          </button>
                          <button onClick={() => setEditingId(null)} disabled={isBusy}
                            className="px-3 py-1.5 rounded text-xs font-semibold"
                            style={{ background: "var(--muted)", color: "var(--foreground)" }}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{user.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase"
                            style={{ background: user.role === "admin" ? "var(--primary)" : "var(--muted)", color: user.role === "admin" ? "white" : "var(--muted-foreground)" }}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button onClick={() => startEdit(user)}
                            className="px-3 py-1.5 rounded text-xs font-semibold mr-2 hover:opacity-80"
                            style={{ background: "var(--muted)", color: "var(--foreground)" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(user._id)} disabled={isSelf || isBusy}
                            title={isSelf ? "You cannot delete your own account" : undefined}
                            className="px-3 py-1.5 rounded text-xs font-semibold hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: "transparent", color: "#f87171", border: "1px solid #f87171" }}>
                            {isBusy ? "…" : "Remove"}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
