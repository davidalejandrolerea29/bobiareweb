import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, ImagePlus, LoaderCircle, Mail, RotateCcw, X } from 'lucide-react';
import { messageTemplatesApi, MessageTemplate } from '../../services/messageTemplatesApi';
import { ApiError } from '../../services/apiClient';
import { resizeImageFile } from '../../utils/imageResize';
import MermaidDiagram from '../../components/admin/MermaidDiagram';

// Mismo flujo que mds/2026-08-02-estados-del-pedido.md, coloreado por
// etapa para que se lea de un vistazo. Puramente visual — no está
// enganchado a los clicks (mermaid permite `click` pero es frágil dentro
// de un SPA; los cards de abajo son la forma real de editar cada uno).
const DIAGRAM_DEFINITION = `
stateDiagram-v2
    [*] --> pending_payment
    pending_payment --> paid: pago acreditado
    paid --> shipped_by_customer: cliente despacha a taller
    paid --> received: admin marca recibido
    shipped_by_customer --> received: admin marca recibido
    received --> in_process: admin avanza
    in_process --> ready_to_return: admin avanza
    ready_to_return --> shipped_to_customer: admin carga tracking
    shipped_to_customer --> [*]

    classDef pending fill:#fab219,color:#1a1a19,stroke:#c98500
    classDef paid fill:#2a78d6,color:#ffffff,stroke:#184f95
    classDef transit fill:#1baf7a,color:#ffffff,stroke:#0d7a52
    classDef received fill:#0ca30c,color:#ffffff,stroke:#087a08
    classDef process fill:#4a3aa7,color:#ffffff,stroke:#332876
    classDef ready fill:#e87ba4,color:#1a1a19,stroke:#c94f7d
    classDef dispatched fill:#eb6834,color:#ffffff,stroke:#c94f1c

    class pending_payment pending
    class paid paid
    class shipped_by_customer transit
    class received received
    class in_process process
    class ready_to_return ready
    class shipped_to_customer dispatched
`;

const AdminMessageTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const loadTemplates = () => {
    setLoading(true);
    setLoadError(null);
    messageTemplatesApi
      .list()
      .then(setTemplates)
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'No se pudieron cargar los mensajes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial
    loadTemplates();
  }, []);

  const handleSaved = (updated: MessageTemplate) => {
    setTemplates((current) => current.map((t) => (t.status === updated.status ? updated : t)));
    setEditingStatus(null);
  };

  const editingTemplate = templates.find((t) => t.status === editingStatus) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Mensajes por estado</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Personalizá el asunto, el cuerpo y el banner del mail que le llega al cliente en cada
          cambio de estado del pedido. Usá <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">{'{order_id}'}</code>{' '}
          donde quieras que aparezca el número de pedido.
        </p>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-neutral-900">Flujo del pedido</h3>
        <MermaidDiagram definition={DIAGRAM_DEFINITION} />
      </section>

      {loadError && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          {loadError}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-14 text-neutral-500">
          <LoaderCircle size={20} className="animate-spin" /> Cargando mensajes...
        </div>
      )}

      {!loading && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.status}
              type="button"
              onClick={() => setEditingStatus(template.status)}
              className="flex flex-col items-start rounded-lg border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:border-primary-300 hover:shadow-md"
            >
              <div className="mb-2 flex w-full items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-neutral-500">
                  <Mail size={14} /> {template.status_label}
                </span>
                {template.is_customized && (
                  <span className="rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700">
                    Personalizado
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-sm font-medium text-neutral-800">
                {template.subject || template.default_subject}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                {template.body || template.default_body}
              </p>
            </button>
          ))}
        </section>
      )}

      {editingTemplate && (
        <MessageTemplateEditor
          template={editingTemplate}
          onClose={() => setEditingStatus(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

interface MessageTemplateEditorProps {
  template: MessageTemplate;
  onClose: () => void;
  onSaved: (updated: MessageTemplate) => void;
}

const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = ({ template, onClose, onSaved }) => {
  const [subject, setSubject] = useState(template.subject ?? '');
  const [body, setBody] = useState(template.body ?? '');
  const [bannerPreview, setBannerPreview] = useState<string | null>(template.banner_image_url);
  const [bannerFile, setBannerFile] = useState<string | null>(null); // base64 nuevo, pendiente de guardar
  const [bannerRemoved, setBannerRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBannerChange = async (file: File | null) => {
    if (!file) return;
    const resized = await resizeImageFile(file);
    setBannerFile(resized);
    setBannerPreview(resized);
    setBannerRemoved(false);
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setBannerRemoved(true);
  };

  const handleResetToDefault = () => {
    setSubject('');
    setBody('');
    handleRemoveBanner();
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const updated = await messageTemplatesApi.update(template.status, {
        subject: subject.trim() || null,
        body: body.trim() || null,
        banner_image: bannerFile ?? undefined,
        remove_banner: bannerRemoved,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el mensaje.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-heading text-lg font-bold text-neutral-900">{template.status_label}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-neutral-700">Asunto</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={template.default_subject}
              className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-neutral-700">Cuerpo del mensaje</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={template.default_body}
              rows={5}
              className="w-full resize-y rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <div>
            <span className="mb-1 block text-sm font-semibold text-neutral-700">Banner (opcional)</span>
            {bannerPreview ? (
              <div className="relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                <img src={bannerPreview} alt="Banner" className="aspect-[3/1] w-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveBanner}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-md bg-white text-neutral-700 shadow hover:bg-red-50 hover:text-red-600"
                  aria-label="Quitar banner"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="grid aspect-[3/1] cursor-pointer place-items-center rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 text-center hover:border-primary-400 hover:bg-primary-50">
                <span>
                  <ImagePlus size={24} className="mx-auto text-neutral-400" />
                  <span className="mt-1 block text-xs font-semibold text-neutral-700">Subir imagen</span>
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleBannerChange(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700"
          >
            <RotateCcw size={15} /> Restaurar por defecto
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? 'Guardando' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageTemplatesPage;
