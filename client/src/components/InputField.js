import React, { useState, useEffect } from 'react';
import * as api from '../api/api';
import { toast } from 'react-toastify';
import { HelpCircle } from 'lucide-react';

const InputField = ({ field, value, onChange }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onChange(name, type === 'checkbox' ? checked : value);
    };
    
    const commonProps = {
        name: field.field_name,
        required: field.is_required,
        placeholder: field.input_placeholder || '',
    };
    
    const safeValue = value ?? '';

    const renderInput = () => {
        switch (field.field_type) {
            case 'textarea':
                return <textarea {...commonProps} value={safeValue} onChange={handleChange} rows="3" className="form-textarea" />;
            case 'number':
                return <input type="number" {...commonProps} value={safeValue} onChange={handleChange} className="form-input" />;
            case 'date':
                const dateValue = safeValue ? new Date(safeValue).toISOString().split('T')[0] : '';
                return <input type="date" {...commonProps} value={dateValue} onChange={handleChange} className="form-input" />;
            case 'email':
                return <input type="email" {...commonProps} value={safeValue} onChange={handleChange} className="form-input" />;
            case 'checkbox':
                return (
                    <div style={{paddingTop: '0.5rem'}}>
                        <input type="checkbox" name={field.field_name} checked={!!value} onChange={handleChange} className="form-checkbox" />
                    </div>
                );
            default: // text
                return <input type="text" {...commonProps} value={safeValue} onChange={handleChange} className="form-input" />;
        }
    }

    return (
        <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <div style={{width: '100%'}}>
                {renderInput()}
            </div>
            {field.field_description && (
                <div title={field.field_description} style={{marginLeft: '0.5rem', cursor: 'help'}}>
                    <HelpCircle size={16} color="#6b7280" />
                </div>
            )}
        </div>
    );
};

export default InputField;
