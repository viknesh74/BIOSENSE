import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '../ui/AlertDialog';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export function DeleteCollarDialog({
  open,
  onOpenChange,
  collar, // { id, name }
  onConfirmDelete, // async (collarId) => Promise
  t = (k) => k
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  if (!collar) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(collar.id);
      showToast(
        t(`Collar ${collar.id} (${collar.name}) has been permanently deleted from records.`),
        'warning'
      );
      onOpenChange(false);
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || t('Failed to delete collar. Please try again.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('Delete this collar?', 'இந்த காலரை நீக்கவா?', 'क्या यह कॉलर हटाएं?')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              `This will remove collar ${collar.id} (${collar.name}) from your active livestock records. Historical health records may be retained according to the application's data policy.`,
              `இது காலர் ${collar.id} (${collar.name}) ஐ உங்கள் செயலில் உள்ள கால்நடை பதிவுகளிலிருந்து நீக்கும். வரலாற்று மருத்துவ பதிவுகள் தக்கவைக்கப்படலாம்.`,
              `यह आपके सक्रिय पशुधन रिकॉर्ड से कॉलर ${collar.id} (${collar.name}) को हटा देगा। ऐतिहासिक स्वास्थ्य रिकॉर्ड बनाए रखे जा सकते हैं।`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {t('Cancel', 'ரத்து செய்', 'रद्द करें')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {t('Delete Collar', 'நீக்கு', 'हटाएं')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
