const mongoose = require('mongoose');

// This is a utility function to get a compiled Mongoose model for a dynamic collection.
// It now ALWAYS rebuilds the model to ensure the latest schema is used.
const getDynamicModel = (tableName, schemaFields) => {
  
  // If a model with this name already exists, delete it from Mongoose's cache.
  // This is the key to ensuring the schema is always fresh.
  if (mongoose.models[tableName]) {
    delete mongoose.models[tableName];
  }

  const schemaDefinition = {};
  schemaFields.forEach(field => {
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
    collection: tableName,
    strict: false, // Important: Allows saving fields not strictly in the schema
  });

  // Compile and return the new model.
  return mongoose.model(tableName, dynamicSchema);
};

module.exports = getDynamicModel;
