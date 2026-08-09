import mongoose from 'mongoose';

const SearchSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
term: { type: String, required: true },
timestamp: { type: Date, default: Date.now }
});

SearchSchema.index({ user: 1, timestamp: -1 });
SearchSchema.index({ term: 1 });

export default mongoose.model('Search', SearchSchema);
