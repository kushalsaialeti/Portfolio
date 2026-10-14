import { useEffect } from 'react';

/**
 * Small bridge between editors and the dashboard navigation guard. Editors can
 * keep their existing local state while opting into the same unsaved-change
 * behaviour.
 */
export function useEditorDirty(isDirty, isSaving = false) {
  useEffect(() => {
    const notify = (dirty) => window.dispatchEvent(new CustomEvent('admin:dirty', { detail: { dirty } }));
    notify(Boolean(isDirty));

    const handleBeforeUnload = (event) => {
      if (isDirty && !isSaving) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      notify(false);
    };
  }, [isDirty, isSaving]);
}
