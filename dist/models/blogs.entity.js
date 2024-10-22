import { model, Schema, Types } from 'mongoose';
const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });
export const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
    published: { type: Boolean, default: false },
    featuredImage: { type: String }, // Campo para la imagen destacada
    slug: { type: String, required: true, unique: true }, // Campo slug único para la URL
    comments: [CommentSchema], // Array de comentarios
}, { timestamps: true });
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
export const Post = model('Post', PostSchema);
