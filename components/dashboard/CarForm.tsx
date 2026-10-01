"use client";

import { useRef, useState, type FormEvent } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, Toggle } from "@/components/ui/field";
import { db } from "@/lib/firebase";
import { uploadCarImage } from "@/lib/image";
import { BODY_TYPES } from "@/lib/sample-cars";
import type { Car, CarStatus } from "@/lib/types";

const FUELS = ["Gasoline", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];

export function CarForm({ car, onDone }: { car: Car | null; onDone: () => void }) {
  const [status, setStatus] = useState<CarStatus>(car?.status ?? "available");
  const [featured, setFeatured] = useState(car?.featured ?? false);
  const [images, setImages] = useState<{ url: string; path: string }[]>(
    car ? car.images.map((url, index) => ({ url, path: car.imagePaths[index] ?? "" })) : [],
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Reserve the document id up front so images upload under cars/{id}/.
  const [carId] = useState(() => car?.id ?? doc(collection(db, "cars")).id);

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadCarImage(carId, file)));
      setImages((current) => [...current, ...uploaded]);
    } catch {
      setError("One or more images failed to upload.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    try {
      const data = {
        make: String(form.get("make")).trim(),
        model: String(form.get("model")).trim(),
        bodyType: String(form.get("bodyType")),
        year: Number(form.get("year")),
        price: Number(form.get("price")),
        mileage: Number(form.get("mileage")),
        transmission: String(form.get("transmission")),
        fuel: String(form.get("fuel")),
        color: String(form.get("color")).trim(),
        description: String(form.get("description")).trim(),
        status,
        featured,
        images: images.map((image) => image.url),
        imagePaths: images.map((image) => image.path),
        // Stamp the sale date when a car first moves to "sold"; clear it if reverted.
        soldAt: status === "sold" ? (car?.soldAt ?? Date.now()) : null,
      };
      await setDoc(doc(db, "cars", carId), { ...data, createdAt: car?.createdAt ?? Date.now() });
      onDone();
    } catch {
      setError("Couldn't save this vehicle. Check your connection and permissions.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Make">
          <Input name="make" required defaultValue={car?.make} />
        </Field>
        <Field label="Model">
          <Input name="model" required defaultValue={car?.model} />
        </Field>
        <Field label="Year">
          <Input
            name="year"
            type="number"
            required
            min={1950}
            max={new Date().getFullYear() + 1}
            defaultValue={car?.year ?? new Date().getFullYear()}
          />
        </Field>
        <Field label="Body type">
          <Select name="bodyType" defaultValue={car?.bodyType ?? BODY_TYPES[0]}>
            {BODY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </Select>
        </Field>
        <Field label="Price">
          <Input name="price" type="number" required min={0} defaultValue={car?.price} />
        </Field>
        <Field label="Mileage">
          <Input name="mileage" type="number" required min={0} defaultValue={car?.mileage ?? 0} />
        </Field>
        <Field label="Transmission">
          <Select name="transmission" defaultValue={car?.transmission ?? TRANSMISSIONS[0]}>
            {TRANSMISSIONS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Fuel">
          <Select name="fuel" defaultValue={car?.fuel ?? FUELS[0]}>
            {FUELS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Field>
        <Field label="Color">
          <Input name="color" defaultValue={car?.color} />
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(event) => setStatus(event.target.value as CarStatus)}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </Select>
        </Field>
      </div>

      <Field label="Description">
        <Textarea name="description" defaultValue={car?.description} />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-300">Photos</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                className="absolute top-1.5 right-1.5 rounded-full bg-slate-950/80 p-1 text-slate-300 backdrop-blur transition-[color,transform] hover:text-white active:scale-90"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 text-xs text-slate-500 transition-[border-color,color,transform] hover:border-slate-500 hover:text-slate-300 active:scale-[0.98] disabled:opacity-50"
          >
            <ImagePlus className="size-5" />
            {uploading ? "Uploading…" : "Add photos"}
          </button>
        </div>
        {/* capture-friendly on mobile: opens the camera roll or camera */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => void addImages(event.target.files)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Photos are resized and converted to WebP on your device before upload.
        </p>
      </div>

      <Toggle
        checked={featured}
        onChange={setFeatured}
        label="Featured"
        description="Show this vehicle first on the public site."
      />

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving…" : car ? "Save changes" : "Add vehicle"}
        </Button>
      </div>
    </form>
  );
}
