import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
provider: { type: String, required: true },
providerId: { type: String, required: true, index: true },
displayName: { type: String, required: true },
photo: String
}, { timestamps: true });

UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);
