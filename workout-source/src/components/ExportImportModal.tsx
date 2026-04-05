import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useAppData } from '../context/DataContext';
import type { AppData } from '../types';

interface Props { onClose: () => void }

function isValidAppData(obj: unknown): obj is AppData {
  if (typeof obj !== 'object' || obj === null) return false;
  const d = obj as Record<string, unknown>;
  return Array.isArray(d.exercises) && Array.isArray(d.sessions);
}

export function ExportImportModal({ onClose }: Props) {
  const { data, dispatch } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importData, setImportData] = useState<AppData | null>(null);
  const [importError, setImportError] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!isValidAppData(parsed)) throw new Error('Invalid format');
        setImportData(parsed);
        setImportError('');
      } catch {
        setImportError('Invalid file. Please select a valid workout backup JSON.');
        setImportData(null);
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!importData) return;
    if (importMode === 'replace') {
      dispatch({ type: 'REPLACE_ALL', payload: importData });
    } else {
      // merge: add exercises and sessions that don't exist yet
      const existingExIds = new Set(data.exercises.map((e) => e.id));
      const existingSessionIds = new Set(data.sessions.map((s) => s.id));
      const merged: AppData = {
        exercises: [
          ...data.exercises,
          ...importData.exercises.filter((e) => !existingExIds.has(e.id)),
        ],
        sessions: [
          ...data.sessions,
          ...importData.sessions.filter((s) => !existingSessionIds.has(s.id)),
        ],
      };
      dispatch({ type: 'REPLACE_ALL', payload: merged });
    }
    setImportData(null);
    onClose();
  }

  return (
    <Modal title="Export / Import" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Export */}
        <section>
          <h3 className="font-medium text-gray-900 mb-1">Export</h3>
          <p className="text-sm text-gray-500 mb-3">
            Download all your data as a JSON file. Keep it as a backup or transfer to another device.
          </p>
          <Button onClick={handleExport} className="w-full">Download backup</Button>
        </section>

        {/* Import */}
        <section>
          <h3 className="font-medium text-gray-900 mb-1">Import</h3>
          <p className="text-sm text-gray-500 mb-3">
            Restore data from a previously exported backup file.
          </p>

          <div className="flex gap-2 mb-3">
            {(['replace', 'merge'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setImportMode(mode)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  importMode === mode
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {mode === 'replace' ? 'Replace all' : 'Merge (add new)'}
              </button>
            ))}
          </div>

          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          <Button variant="secondary" className="w-full mb-2" onClick={() => fileRef.current?.click()}>
            Choose file
          </Button>

          {importError && <p className="text-sm text-red-600">{importError}</p>}

          {importData && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              <p className="font-medium mb-1">File loaded successfully</p>
              <p>{importData.exercises.length} exercises, {importData.sessions.length} sessions</p>
              <Button className="mt-3 w-full" onClick={handleImport}>
                {importMode === 'replace' ? 'Replace & import' : 'Merge & import'}
              </Button>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
}
