import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import type { Exercise } from '../types';

interface ExerciseModalProps {
  initial?: Exercise;
  onSave: (data: Omit<Exercise, 'id'>) => void;
  onClose: () => void;
}

export function ExerciseModal({ initial, onSave, onClose }: ExerciseModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [muscleGroup, setMuscleGroup] = useState(initial?.muscleGroup ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    onSave({ name: name.trim(), muscleGroup: muscleGroup.trim() || undefined });
    onClose();
  }

  return (
    <Modal
      title={initial ? 'Edit Exercise' : 'New Exercise'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          id="ex-name"
          label="Name"
          placeholder="e.g. Bench Press"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          error={error}
          autoFocus
        />
        <Input
          id="ex-group"
          label="Muscle group (optional)"
          placeholder="e.g. Chest"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        />
      </form>
    </Modal>
  );
}
