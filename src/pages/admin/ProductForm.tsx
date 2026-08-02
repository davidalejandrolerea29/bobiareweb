import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ImagePlus, LoaderCircle, PackagePlus, Plus, X } from 'lucide-react';
import { catalogApi, ProductAttributePayload } from '../../services/catalogApi';
import { ApiError } from '../../services/apiClient';
import { Attribute, AttributeType, Category, DeliveryTime, ProductImage } from '../../types';
import { resizeImageFile, urlToBase64 } from '../../utils/imageResize';

const DEFAULT_NEW_COLOR_HEX = '#DC2626';

type ImageSlot =
  | { kind: 'existing'; id: number; url: string }
  | { kind: 'new'; file: File; previewUrl: string };

export interface ProductFormInitialData {
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  categoryIds: number[];
  deliveryTimeIds: number[];
  selectedColorIds: number[];
  images: ProductImage[];
}

export interface ProductFormSubmitValues {
  name: string;
  description?: string;
  price: number;
  offer_price: number | null;
  category_ids: number[];
  delivery_time_ids: number[];
  attributes: ProductAttributePayload[];
  images?: string[]; // undefined solo en modo "edit" == no se tocaron las imágenes
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormInitialData;
  heading: string;
  subheading: string;
  submitLabel: string;
  submittingLabel: string;
  onCancel: () => void;
  onSubmit: (values: ProductFormSubmitValues) => Promise<void>;
}

const toImageSlots = (images: ProductImage[]): ImageSlot[] =>
  images.map((img) => ({ kind: 'existing' as const, id: img.id, url: img.url }));

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  initialData,
  heading,
  subheading,
  submitLabel,
  submittingLabel,
  onCancel,
  onSubmit,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryTimes, setDeliveryTimes] = useState<DeliveryTime[]>([]);
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData?.price ?? '');
  const [offerPrice, setOfferPrice] = useState(initialData?.offerPrice ?? '');
  const [categoryIds, setCategoryIds] = useState<number[]>(initialData?.categoryIds ?? []);
  const [deliveryTimeIds, setDeliveryTimeIds] = useState<number[]>(initialData?.deliveryTimeIds ?? []);

  const [images, setImages] = useState<ImageSlot[]>(() => toImageSlots(initialData?.images ?? []));
  const initialExistingImageCount = initialData?.images.length ?? 0;

  // Colores: se pueden elegir de la paleta existente (attribute_id ya
  // creado) o agregar uno nuevo (se crea en el backend al reutilizarse el
  // mismo flujo de "attributes" que ya soporta otros tipos de atributo).
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>(initialData?.selectedColorIds ?? []);
  const [customColors, setCustomColors] = useState<{ description: string; hex_value: string }[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState(DEFAULT_NEW_COLOR_HEX);

  const colorType = attributeTypes.find((type) => type.key === 'color_picker');

  useEffect(() => {
    catalogApi
      .catalogData()
      .then((data) => {
        setCategories(data.categories);
        setDeliveryTimes(data.delivery_times);
        setAttributeTypes(data.attribute_types);
      })
      .catch(() => setError('No se pudieron cargar las categorías y tiempos de entrega.'))
      .finally(() => setLoadingCatalog(false));
  }, []);

  useEffect(
    () => () => {
      images.forEach((slot) => {
        if (slot.kind === 'new') URL.revokeObjectURL(slot.previewUrl);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo limpia al desmontar, no en cada cambio
    [],
  );

  const toggleId = (list: number[], id: number) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newSlots: ImageSlot[] = Array.from(files).map((file) => ({
      kind: 'new',
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...newSlots]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => {
      const slot = current[index];
      if (slot.kind === 'new') URL.revokeObjectURL(slot.previewUrl);
      return current.filter((_, i) => i !== index);
    });
  };

  const toggleColorId = (id: number) => setSelectedColorIds((current) => toggleId(current, id));

  const handleAddCustomColor = () => {
    const trimmedName = newColorName.trim();
    if (!trimmedName) return;
    setCustomColors((current) => [...current, { description: trimmedName, hex_value: newColorHex }]);
    setNewColorName('');
    setNewColorHex(DEFAULT_NEW_COLOR_HEX);
  };

  const handleRemoveCustomColor = (index: number) => {
    setCustomColors((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (categoryIds.length === 0 || deliveryTimeIds.length === 0 || images.length === 0) {
      setError('Seleccioná una categoría, un tiempo de entrega y al menos una imagen.');
      return;
    }

    setSubmitting(true);
    try {
      const existingImageCountNow = images.filter((slot) => slot.kind === 'existing').length;
      const hasNewFiles = images.some((slot) => slot.kind === 'new');
      const imagesChanged = mode === 'create' || hasNewFiles || existingImageCountNow !== initialExistingImageCount;

      let resolvedImages: string[] | undefined;
      if (imagesChanged) {
        // Achica/comprime las nuevas antes de mandarlas — el backend guarda
        // el archivo tal cual llega, sin procesar (ver utils/imageResize.ts).
        // Las que ya estaban subidas se reenvían tal cual (ya vienen
        // comprimidas de una subida anterior).
        resolvedImages = await Promise.all(
          images.map((slot) => (slot.kind === 'new' ? resizeImageFile(slot.file) : urlToBase64(slot.url))),
        );
      }

      const attributes: ProductAttributePayload[] = [];
      if (colorType) {
        for (const colorId of selectedColorIds) {
          const attribute = colorType.attributes.find((a) => a.id === colorId);
          if (!attribute) continue;
          attributes.push({
            attribute_type_id: colorType.id,
            attribute_id: attribute.id,
            description: attribute.description,
            hex_value: attribute.hex_value,
          });
        }
        for (const custom of customColors) {
          attributes.push({
            attribute_type_id: colorType.id,
            description: custom.description,
            hex_value: custom.hex_value,
          });
        }
      }

      await onSubmit({
        name,
        description: description || undefined,
        price: Number(price),
        offer_price: offerPrice ? Number(offerPrice) : null,
        category_ids: categoryIds,
        delivery_time_ids: deliveryTimeIds,
        attributes,
        images: resolvedImages,
      });
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'No se pudo guardar el servicio.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCatalog) {
    return (
      <div className="grid min-h-80 place-items-center text-neutral-500">
        <div className="text-center">
          <LoaderCircle size={28} className="mx-auto animate-spin text-primary-600" />
          <p className="mt-3 text-sm">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-primary-700"
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <h2 className="text-2xl font-bold text-neutral-900">{heading}</h2>
          <p className="mt-1 text-sm text-neutral-500">{subheading}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <PackagePlus size={18} />}
            {submitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-neutral-900">Información general</h3>
              <p className="mt-1 text-xs text-neutral-500">Nombre, descripción y valores de venta.</p>
            </div>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">Nombre del servicio</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej. Arenado de cuadro de bicicleta"
                  className="h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-neutral-700">Descripción</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describí el servicio, alcance y terminación."
                  rows={5}
                  className="w-full resize-y rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-neutral-700">Precio</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="0,00"
                      className="h-11 w-full rounded-md border border-neutral-300 pl-7 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      required
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-neutral-700">Precio de oferta</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={offerPrice}
                      onChange={(event) => setOfferPrice(event.target.value)}
                      placeholder="Opcional"
                      className="h-11 w-full rounded-md border border-neutral-300 pl-7 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-semibold text-neutral-900">Disponibilidad</h3>
            <p className="mt-1 text-xs text-neutral-500">Definí cómo se organiza el servicio en el catálogo.</p>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-neutral-700">Categorías</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-neutral-200 px-3 text-sm text-neutral-700 hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => setCategoryIds((current) => toggleId(current, category.id))}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    {category.description}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-neutral-700">Tiempos de entrega</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {deliveryTimes.map((deliveryTime) => (
                  <label key={deliveryTime.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-neutral-200 px-3 text-sm text-neutral-700 hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={deliveryTimeIds.includes(deliveryTime.id)}
                      onChange={() => setDeliveryTimeIds((current) => toggleId(current, deliveryTime.id))}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    {deliveryTime.description}
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          {colorType && (
            <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-semibold text-neutral-900">Colores</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Opcional. El cliente va a poder elegir uno de estos colores en la página del servicio.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {colorType.attributes.map((attribute) => (
                  <ColorSwatchButton
                    key={attribute.id}
                    attribute={attribute}
                    selected={selectedColorIds.includes(attribute.id)}
                    onClick={() => toggleColorId(attribute.id)}
                  />
                ))}
                {customColors.map((color, index) => (
                  <div key={`${color.description}-${index}`} className="relative">
                    <span
                      title={color.description}
                      style={{ backgroundColor: color.hex_value }}
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary-600 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomColor(index)}
                      aria-label={`Quitar color ${color.description}`}
                      className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-neutral-600 shadow hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Nuevo color</span>
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(event) => setNewColorName(event.target.value)}
                    placeholder="Ej. Dorado"
                    className="h-10 w-40 rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-neutral-600">Color</span>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(event) => setNewColorHex(event.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-md border border-neutral-300"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  disabled={!newColorName.trim()}
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-neutral-300 px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>
            </section>
          )}
        </div>

        <aside>
          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-neutral-900">Imágenes</h3>
            <p className="mt-1 text-xs text-neutral-500">
              Subí una o más fotos claras del trabajo. La primera se usa como portada; se muestran como galería.
            </p>

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {images.map((slot, index) => (
                  <div
                    key={slot.kind === 'existing' ? `existing-${slot.id}` : slot.previewUrl}
                    className="relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
                  >
                    <img
                      src={slot.kind === 'existing' ? slot.url : slot.previewUrl}
                      alt={`Vista previa ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-white text-neutral-700 shadow hover:bg-red-50 hover:text-red-600"
                      aria-label={`Quitar imagen ${index + 1}`}
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Portada
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="mt-4 grid aspect-[4/3] cursor-pointer place-items-center rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 text-center hover:border-primary-400 hover:bg-primary-50">
              <span>
                <ImagePlus size={28} className="mx-auto text-neutral-400" />
                <span className="mt-3 block text-sm font-semibold text-neutral-700">
                  {images.length > 0 ? 'Agregar más imágenes' : 'Seleccionar imágenes'}
                </span>
                <span className="mt-1 block text-xs text-neutral-500">PNG, JPG o WEBP</span>
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={(event) => {
                  handleAddFiles(event.target.files);
                  event.target.value = '';
                }}
                className="sr-only"
              />
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
};

interface ColorSwatchButtonProps {
  attribute: Attribute;
  selected: boolean;
  onClick: () => void;
}

const ColorSwatchButton: React.FC<ColorSwatchButtonProps> = ({ attribute, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={attribute.description}
    aria-label={attribute.description}
    aria-pressed={selected}
    style={{ backgroundColor: attribute.hex_value ?? undefined }}
    className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-shadow ${
      selected ? 'border-primary-600 shadow-md ring-2 ring-primary-200' : 'border-neutral-300'
    } ${!attribute.hex_value ? 'bg-neutral-200' : ''}`}
  />
);

export default ProductForm;
