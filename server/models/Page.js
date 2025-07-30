const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    field_name: { type: String, required: true },
    field_label: { type: String, required: true },
    field_type: { 
        type: String, 
        required: true,
        enum: ['text', 'textarea', 'number', 'date', 'select', 'checkbox', 'email'] 
    },
    default_value: { type: mongoose.Schema.Types.Mixed },
    // ref_table: { type: String },
    // ref_column: { type: String },
    // is_indexed: { type: Boolean, default: false },
    is_used_for_stats: { type: Boolean, default: false },
    is_used_for_search: { type: Boolean, default: false },
    is_required: { type: Boolean, default: false },
    validation_rules: { type: Object },
    success_message: { type: String },
    failure_message: { type: String },
    field_description: { type: String },
    input_placeholder: { type: String },
});

const PageSchema = new mongoose.Schema({
  page_name: {
    type: String,
    required: [true, 'Please add a page name'],
    unique: true,
    trim: true,
  },
  page_description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  route: {
    type: String,
    required: true,
    unique: true,
  },
  table_name: {
    type: String,
    required: true,
    unique: true,
  },
  fields: [FieldSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to create/update collection and indexes when a page is saved
PageSchema.post('save', async function (doc, next) {
    try {
        const schemaDefinition = {};
        doc.fields.forEach(field => {
            let fieldType;
            switch (field.field_type) {
                case 'number':
                    fieldType = Number;
                    break;
                case 'date':
                    fieldType = Date;
                    break;
                case 'checkbox':
                    fieldType = Boolean;
                    break;
                default:
                    fieldType = String;
            }
            schemaDefinition[field.field_name] = { type: fieldType };
        });

        const dynamicSchema = new mongoose.Schema(schemaDefinition, {
            timestamps: true,
            collection: doc.table_name,
            strict: false, // *** THIS IS THE ADDED SAFEGUARD ***
        });

        // Create indexes
        doc.fields.forEach(field => {
            if (field.is_indexed) {
                dynamicSchema.index({ [field.field_name]: 1 });
            }
        });
        
        // Delete the old model if it exists, so it can be re-compiled
        if (mongoose.models[doc.table_name]) {
            delete mongoose.models[doc.table_name];
        }
        
        // Register the new model
        mongoose.model(doc.table_name, dynamicSchema);

    } catch (error) {
        console.error('Error creating/updating dynamic model/collection:', error);
    }
    next();
});

module.exports = mongoose.model('Page', PageSchema);
