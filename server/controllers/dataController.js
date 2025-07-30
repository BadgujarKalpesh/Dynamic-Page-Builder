const getDynamicModel = require('../models/dynamicModel');
const Page = require('../models/Page');

// --- Validation Helper Function ---
const validateData = (fields, body) => {
    for (const field of fields) {
        const value = body[field.field_name];

        // Check for required fields
        if (field.is_required && (value === undefined || value === null || value === '')) {
            throw new Error(field.failure_message || `Field '${field.field_label}' is required.`);
        }

        if (value === undefined || value === null) continue; // Skip other validations if value is not present

        // Check validation_rules
        if (field.validation_rules) {
            const rules = field.validation_rules;

            // Min/Max length for strings
            if (rules.min && String(value).length < rules.min) {
                 throw new Error(field.failure_message || `${field.field_label} must be at least ${rules.min} characters.`);
            }
            if (rules.max && String(value).length > rules.max) {
                 throw new Error(field.failure_message || `${field.field_label} must be no more than ${rules.max} characters.`);
            }

            // Min/Max value for numbers
            if (field.field_type === 'number') {
                if (rules.min !== undefined && Number(value) < rules.min) {
                    throw new Error(field.failure_message || `${field.field_label} must be at least ${rules.min}.`);
                }
                if (rules.max !== undefined && Number(value) > rules.max) {
                    throw new Error(field.failure_message || `${field.field_label} must be no more than ${rules.max}.`);
                }
            }

            // Regex for strings
            if (rules.regex) {
                // Regex comes as a string from JSON, so we need to create a RegExp object
                const pattern = new RegExp(rules.regex);
                if (!pattern.test(value)) {
                    throw new Error(field.failure_message || `${field.field_label} format is invalid.`);
                }
            }
        }
    }
};


// Middleware to get model for a table
const getModelForTable = async (req, res, next) => {
    try {
        const { tableName } = req.params;
        const pageConfig = await Page.findOne({ table_name: tableName });
        if (!pageConfig) {
            return res.status(404).json({ success: false, error: 'Configuration for this table not found.' });
        }
        req.model = getDynamicModel(tableName, pageConfig.fields);
        req.pageConfig = pageConfig;
        next();
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all data from a dynamic table with pagination
// @route   GET /api/data/:tableName
exports.getData = [getModelForTable, async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        const total = await req.model.countDocuments();
        const data = await req.model.find().skip(skip).limit(limit);
        
        res.status(200).json({ 
            success: true, 
            count: data.length, 
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            data 
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}];

// @desc    Get single data item
// @route   GET /api/data/:tableName/:id
exports.getDatum = [getModelForTable, async (req, res) => {
    try {
        const item = await req.model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}];


// @desc    Create data in a dynamic table
// @route   POST /api/data/:tableName
exports.createData = [getModelForTable, async (req, res) => {
    try {
        validateData(req.pageConfig.fields, req.body);
        const item = await req.model.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}];

// @desc    Update data in a dynamic table
// @route   PUT /api/data/:tableName/:id
exports.updateData = [getModelForTable, async (req, res) => {
    try {
        validateData(req.pageConfig.fields, req.body);
        const item = await req.model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}];

// @desc    Delete data from a dynamic table
// @route   DELETE /api/data/:tableName/:id
exports.deleteData = [getModelForTable, async (req, res) => {
    try {
        const item = await req.model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        await item.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}];


