import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Badge } from '../ui/Badge';
import { Cpu, Tag, Check, AlertCircle, Info, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../ui/Toast';

const PRESET_PHOTOS = [
  { label: 'Gir Cow', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=80' },
  { label: 'Jersey Cross', url: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=500&auto=format&fit=crop&q=80' },
  { label: 'Desi Breed', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Black Murrah', url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=500&auto=format&fit=crop&q=80' }
];

export function CollarFormDialog({
  open,
  onOpenChange,
  initialData = null, // null for add mode, or cattle object for edit mode
  existingCattle = [],
  onSubmit, // async (data) => Promise
  t = (k) => k
}) {
  const isEdit = Boolean(initialData);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nickname: '',
    animalType: 'Cow',
    breed: 'Gir (Desi)',
    age: '3',
    gender: 'Female',
    deviceStatus: 'Online',
    notes: '',
    photo: PRESET_PHOTOS[0].url
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          id: String(initialData.id || ''),
          name: initialData.name || '',
          nickname: initialData.nickname || '',
          animalType: initialData.animalType || 'Cow',
          breed: initialData.breed || 'Gir (Desi)',
          age: initialData.age ? String(initialData.age).replace(/[^0-9.]/g, '') : '3',
          gender: initialData.gender || 'Female',
          deviceStatus: initialData.deviceStatus || 'Online',
          notes: initialData.notes || '',
          photo: initialData.photo || PRESET_PHOTOS[0].url
        });
      } else {
        // Generate a random suggestion for collar ID in add mode
        const randomId = String(Math.floor(Math.random() * 899) + 103);
        setFormData({
          id: randomId,
          name: '',
          nickname: '',
          animalType: 'Cow',
          breed: 'Gir (Desi)',
          age: '3',
          gender: 'Female',
          deviceStatus: 'Online',
          notes: '',
          photo: PRESET_PHOTOS[0].url
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('Livestock name is required');
    }

    if (!isEdit) {
      if (!formData.id.trim()) {
        newErrors.id = t('Collar / Device ID is required');
      } else {
        const normalized = formData.id.trim().toLowerCase();
        const exists = existingCattle.some(
          (c) => String(c.id).toLowerCase() === normalized
        );
        if (exists) {
          newErrors.id = t(`Collar ID "${formData.id.trim()}" is already registered. Please choose a unique ID.`);
        }
      }
    }

    if (!formData.breed.trim()) {
      newErrors.breed = t('Breed is required');
    }

    if (!formData.age || Number(formData.age) <= 0) {
      newErrors.age = t('Valid age is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        id: formData.id.trim(),
        name: formData.name.trim(),
        age: `${formData.age} Years`
      });

      showToast(
        isEdit 
          ? t(`Collar ${formData.id} (${formData.name}) updated successfully!`)
          : t(`New collar ${formData.id} (${formData.name}) registered successfully!`),
        'success'
      );
      onOpenChange(false);
    } catch (err) {
      console.error('Collar save error:', err);
      showToast(err.message || t('Failed to save collar. Please try again.'), 'error');
      setErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Cpu size={20} />
            </span>
            <Badge variant="emerald">{isEdit ? t('Edit Mode') : t('IoT Hardware Link')}</Badge>
          </div>
          <DialogTitle>
            {isEdit
              ? t('Edit Collar & Livestock Details', 'காலர் விவரங்களை மாற்றுக', 'कॉलर विवरण संपादित करें')
              : t('Register New Smart Collar', 'புதிய ஸ்மார்ட் காலர் பதிவு', 'नया स्मार्ट कॉलर पंजीकृत करें')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('Update metadata and animal profile. The primary collar device ID is fixed for telemetry consistency.')
              : t('Link a new physical BioSense collar device to your livestock herd profile with real-time telemetry.')}
          </DialogDescription>
        </DialogHeader>

        {errors.form && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Collar ID */}
            <div>
              <Label required={!isEdit}>{t('Collar / Device ID', 'காலர் ஐடி', 'कॉलर आईडी')}</Label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={isEdit || isSubmitting}
                placeholder="e.g. 103, BC-8902"
                error={Boolean(errors.id)}
                className={isEdit ? "bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-75 font-mono" : "font-mono"}
              />
              {errors.id ? (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.id}</p>
              ) : isEdit ? (
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info size={12} /> {t('Stable device identifier (immutable)')}
                </p>
              ) : null}
            </div>

            {/* Livestock Name */}
            <div>
              <Label required>{t('Livestock Name', 'மாட்டின் பெயர்', 'पशु का नाम')}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g. Nandhini, Kamadhenu"
                error={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Animal Type */}
            <div>
              <Label>{t('Animal Type', 'விலங்கு வகை', 'पशु प्रकार')}</Label>
              <select
                value={formData.animalType}
                onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                disabled={isSubmitting}
                className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Cow">🐄 Cow (பசு)</option>
                <option value="Buffalo">🐃 Buffalo (எருமை)</option>
                <option value="Goat">🐐 Goat (ஆடு)</option>
                <option value="Sheep">🐑 Sheep (செம்மறி)</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <Label required>{t('Breed', 'இனம்', 'नस्ल')}</Label>
              <Input
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                disabled={isSubmitting}
                placeholder="e.g. Gir (Desi), Jersey"
                error={Boolean(errors.breed)}
              />
              {errors.breed && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.breed}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <Label required>{t('Age (Years)', 'வயது', 'आयु (वर्ष)')}</Label>
              <Input
                type="number"
                min="0.5"
                max="25"
                step="0.5"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                disabled={isSubmitting}
                error={Boolean(errors.age)}
              />
              {errors.age && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div>
              <Label>{t('Gender', 'பாலினம்', 'लिंग')}</Label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={isSubmitting}
                className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Female">Female (பெண்)</option>
                <option value="Male">Male (ஆண்)</option>
              </select>
            </div>

            {/* Device Activation Status */}
            <div>
              <Label>{t('Device Status', 'சாதன நிலை', 'डिवाइस स्थिति')}</Label>
              <select
                value={formData.deviceStatus}
                onChange={(e) => setFormData({ ...formData, deviceStatus: e.target.value })}
                disabled={isSubmitting}
                className="w-full h-11 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Online">🟢 Active & Streaming (ஆன்லைன்)</option>
                <option value="Standby">🟡 Standby / Low Power</option>
                <option value="Offline">⚪ Offline / Disconnected</option>
              </select>
            </div>
          </div>

          {/* Photo Selection / Preset */}
          <div>
            <Label className="mb-2">{t('Livestock Photo / Avatar', 'புகைப்படம்', 'तस्वीर')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, photo: preset.url })}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all ${
                    formData.photo === preset.url
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {formData.photo === preset.url && (
                    <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                      <Check className="text-white drop-shadow" size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label>{t('Health Notes & Identifiers', 'குறிப்புகள்', 'टिप्पणियाँ')}</Label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isSubmitting}
              placeholder={t('Optional notes regarding herd tag, breeding history, or health status...')}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none font-sans"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('Cancel', 'ரத்து செய்', 'रद्द करें')}
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
            >
              {isEdit ? t('Save Changes', 'சேமி', 'परिवर्तन सहेजें') : t('Register Collar', 'பதிவு செய்', 'पंजीकृत करें')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
