import { useState, useEffect } from "react";

export default function EditModal({ isOpen, onClose, initialData, onSave }) {
  const [values, setValues] = useState({
    epic: "",
    story: "",
    criteria: "",
    priority: "",
    storyPoints: "",
    moscow: "",
    state: "",
  });

  useEffect(() => {
    if (initialData) {
      setValues({
        epic: initialData.epic,
        story: initialData.story,
        criteria: initialData.criteria,
        priority: initialData.priority,
        storyPoints: initialData.storyPoints,
        moscow: initialData.moscow,
        state: initialData.state,
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-xl w-full p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Modifier la user story</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Catégorie</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              value={values.epic}
              onChange={e => setValues(v => ({ ...v, epic: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm">User Story</label>
            <textarea
              className="mt-1 w-full border rounded px-2 py-1"
              rows={3}
              value={values.story}
              onChange={e => setValues(v => ({ ...v, story: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm">Critères</label>
            <textarea
              className="mt-1 w-full border rounded px-2 py-1"
              rows={2}
              value={values.criteria}
              onChange={e => setValues(v => ({ ...v, criteria: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Priorité</label>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={values.priority}
                onChange={e => setValues(v => ({ ...v, priority: e.target.value }))}
              >
                <option>Bas</option>
                <option>Moyen</option>
                <option>Élevé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Points</label>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={values.storyPoints}
                onChange={e => setValues(v => ({ ...v, storyPoints: e.target.value }))}
              >
                {["XS","S","M","L","XL"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">MoSCoW</label>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={values.moscow}
                onChange={e => setValues(v => ({ ...v, moscow: e.target.value }))}
              >
                {["Doit-avoir","Devrait-avoir","Pourrait-avoir","N'aura pas"].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">État</label>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={values.state}
                onChange={e => setValues(v => ({ ...v, state: e.target.value }))}
              >
                {["à valider","en cours","terminé","à archiver"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(values)}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
