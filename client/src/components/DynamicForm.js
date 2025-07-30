import React, { useState, useEffect } from 'react';
import InputField from './InputField';

const DynamicForm = ({ fields, initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Initialize form data
    useEffect(() => {
        const initial = {};
        fields.forEach(field => {
            if (initialData) {
                initial[field.field_name] = initialData[field.field_name];
            } else {
                initial[field.field_name] = field.default_value !== undefined ? field.default_value : '';
            }
        });
        setFormData(initial);
    }, [fields, initialData]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // --- Client-side validation ---
    const validateForm = () => {
        const newErrors = {};
        console.log("fields :", fields);
        for (const field of fields) {
            const value = formData[field.field_name];

            if (field.is_required && (value === undefined || value === null || value === '')) {
                newErrors[field.field_name] = 'This field is required.';
                continue;
            }
            
            if (field.validation_rules && value) {
                const rules = field.validation_rules;
                if (rules.min && String(value).length < rules.min) {
                    newErrors[field.field_name] = `Must be at least ${rules.min} characters.`;
                }
                if (rules.max && String(value).length > rules.max) {
                    newErrors[field.field_name] = `Must be no more than ${rules.max} characters.`;
                }
                if (field.field_type === 'number') {
                     if (rules.min !== undefined && Number(value) < rules.min) {
                        newErrors[field.field_name] = `Must be at least ${rules.min}.`;
                    }
                    if (rules.max !== undefined && Number(value) > rules.max) {
                        newErrors[field.field_name] = `Must be no more than ${rules.max}.`;
                    }
                }
                if (rules.regex) {
                    const pattern = new RegExp(rules.regex);
                    if (!pattern.test(value)) {
                        newErrors[field.field_name] = 'Invalid format.';
                    }
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-body">
                <div className="form-grid">
                    {fields.filter(f => !f.is_primary_key).map(field => (
                        <div key={field._id} className="form-group">
                            <label>
                                {field.field_label}
                                {field.is_required && <span style={{color: 'red', marginLeft: '0.25rem'}}>*</span>}
                            </label>
                            <InputField
                                field={field}
                                value={formData[field.field_name]}
                                onChange={handleChange}
                            />
                            {errors[field.field_name] && <span style={{color: 'red', fontSize: '0.75rem'}}>{errors[field.field_name]}</span>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </div>
        </form>
    );
};

export default DynamicForm;
