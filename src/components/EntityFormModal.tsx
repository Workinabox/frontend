import { useState } from 'react';

type EntityFormValues = { name: string; description: string; select?: string };

type SelectFieldConfig = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

type EntityFormModalProps = {
  title: string;
  nameLabel?: string;
  initial?: EntityFormValues;
  selectField?: SelectFieldConfig;
  onSubmit: (values: EntityFormValues) => void;
  onClose: () => void;
};

// Shared create/edit dialog for the {name, description} entities
// (orgs, projects, agents, boards, repos, pipelines — and works via nameLabel).
export default function EntityFormModal({
  title,
  nameLabel = 'Name',
  initial,
  selectField,
  onSubmit,
  onClose,
}: EntityFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [select, setSelect] = useState(selectField?.value ?? '');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name: name.trim(),
            description: description.trim(),
            ...(selectField ? { select } : {}),
          });
        }}
      >
        <div className="th">{title}</div>
        <div className="field">
          <label htmlFor="entity-form-name">{nameLabel}</label>
          <input
            id="entity-form-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="entity-form-description">Description</label>
          <textarea
            id="entity-form-description"
            className="input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {selectField ? (
          <div className="field">
            <label htmlFor="entity-form-select">{selectField.label}</label>
            <select
              id="entity-form-select"
              className="input"
              value={select}
              onChange={(e) => setSelect(e.target.value)}
            >
              {selectField.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="actions">
          <button type="button" className="btn ghost small" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary small" disabled={name.trim() === ''}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
