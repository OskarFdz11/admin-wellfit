import { model, Schema, Types } from 'mongoose'

// Esquema para los comentarios de un post
export interface IComment {
    user: Types.ObjectId; // Referencia al usuario que hace el comentario
    content: string;
    createdAt?: Date;
}

const CommentSchema = new Schema<IComment>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
    },
    { timestamps: true }
  )

// Esquema para los posts del blog
export interface IPost {
    title: string;
    content: string;
    author: Types.ObjectId; // Referencia al usuario
    categories: Types.ObjectId[]; // Referencia a las categorías
    published: boolean;
    featuredImage: string; // URL de la imagen destacada
    slug: string; // Slug para la URL amigable
    comments: IComment[]; // Array de comentarios
    createdAt?: Date;
    updatedAt?: Date;
}

export const PostSchema = new Schema<IPost>(
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      categories: [{ type: Types.ObjectId, ref: 'Category' }],
      published: { type: Boolean, default: false },
      featuredImage: { type: String }, // Campo para la imagen destacada
      slug: { type: String, required: true, unique: true }, // Campo slug único para la URL
      comments: [CommentSchema], // Array de comentarios
    },
    { timestamps: true }
)

// Middleware para generar el slug antes de guardar el post si no existe
PostSchema.pre('save', function (next) {
    if (!this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Reemplaza los caracteres no permitidos
        .replace(/^-+|-+$/g, ''); // Elimina guiones al principio y al final
    }
    next();
  });
  
export const Post = model<IPost>('Post', PostSchema);