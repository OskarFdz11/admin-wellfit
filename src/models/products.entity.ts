import { model, Schema, Types } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  shortDescription: string; // Descripción corta
  longDescription: string; // Descripción larga
  featuredImage: string; // Imagen principal (destacada)
  gallery: string[]; // Galería de imágenes adicionales
  category: Types.ObjectId; // Referencia a la categoría
  stock: number;
  visibility: 'hidden' | 'active'; // Visibilidad (oculto o activo)
  discount?: number; // Descuento opcional
  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    shortDescription: { type: String, required: true }, // Descripción corta obligatoria
    longDescription: { type: String, required: true }, // Descripción larga obligatoria
    featuredImage: { type: String, required: true }, // Imagen principal obligatoria
    gallery: [{ type: String }], // Array de URLs de la galería de imágenes
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Relación con la categoría
    stock: { type: Number, default: 0 },
    visibility: { type: String, enum: ['hidden', 'active'], default: 'active' }, // Visibilidad con valor por defecto 'active'
    discount: { type: Number, min: 0 }, // Descuento opcional, valor mínimo de 0
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', ProductSchema);
