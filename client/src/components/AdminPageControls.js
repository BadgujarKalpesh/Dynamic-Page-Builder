import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Trash2, Plus, Save, ChevronDown, ChevronRight } from 'lucide-react';
import * as api from '../api/api';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

// This is a sub-component for editing a single field's properties
const FieldEditor = ({ field, index, onFieldChange, onRemoveField, pages, pageConfig }) => {
    const [advancedVisible, setAdvancedVisible] = useState(false);
    const isIndexCheckboxDisabled = field._id && field.is_indexed;
    // let validationRulesString = field.validation_rules ? JSON.stringify(field.validation_rules, null, 2) : "{}";

    return (
        <div className="field-editor-card">
            <div className="flex justify-between items-center">
                <p className="font-bold">{field.field_label || "New Field"}</p>
                <button onClick={() => onRemoveField(index)}><Trash2 size={16} color="var(--danger-color)" /></button>
            </div>
            <div className="grid-2-col" style={{marginTop: '0.5rem'}}>
                <div>
                    <label>Field Label</label>
                    <input value={field.field_label || ''} onChange={e => onFieldChange(index, 'field_label', e.target.value)} className="form-input" />
                </div>
                <div>
                    <label>Field Name (DB)</label>
                    <input value={field.field_name || ''} onChange={e => onFieldChange(index, 'field_name', e.target.value)} className="form-input" style={{backgroundColor: '#f9fafb'}}/>
                </div>
                <div>
                    <label>Field Type</label>
                    <select value={field.field_type} onChange={e => onFieldChange(index, 'field_type', e.target.value)} className="form-select">
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="email">Email</option>
                    </select>
                </div>
            </div>
            <div className="checkbox-grid">
                <label><input type="checkbox" checked={!!field.is_required} onChange={e => onFieldChange(index, 'is_required', e.target.checked)} /> Required</label>
                <label><input type="checkbox" checked={!!field.is_used_for_search} onChange={e => onFieldChange(index, 'is_used_for_search', e.target.checked)} /> Searchable</label>
                <label><input type="checkbox" checked={!!field.is_used_for_stats} onChange={e => onFieldChange(index, 'is_used_for_stats', e.target.checked)} /> Use in Stats</label>            </div>
            <div style={{marginTop: '0.75rem'}}>
                <button onClick={() => setAdvancedVisible(!advancedVisible)} className="btn-link flex items-center" style={{fontSize: '0.875rem'}}>
                    {advancedVisible ? <ChevronDown size={16} className="mr-1"/> : <ChevronRight size={16} className="mr-1"/>}
                    Advanced Options
                </button>
                {advancedVisible && (
                    <div style={{marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>

                        <div>
                            <label>Placeholder Text</label>
                            <input value={field.input_placeholder || ''} onChange={e => onFieldChange(index, 'input_placeholder', e.target.value)} className="form-input" />
                        </div>
                        <div>
                            <label>Description (Tooltip)</label>
                            <input value={field.field_description || ''} onChange={e => onFieldChange(index, 'field_description', e.target.value)} className="form-input" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// Main Component
const AdminPageControls = ({ pageConfig, setPageConfig }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // State for page properties
    const [pageDetails, setPageDetails] = useState({
        page_name: '',
        page_description: ''
    });
    
    // State for the fields array
    const [fields, setFields] = useState([]);
    
    const { fetchPages, pages } = useContext(AppContext);
    const navigate = useNavigate();

    // When editing starts, populate the local state from the main pageConfig prop
    useEffect(() => {
        if (pageConfig) {
            setPageDetails({
                page_name: pageConfig.page_name,
                page_description: pageConfig.page_description
            });
            setFields(pageConfig.fields);
        }
    }, [pageConfig]);

    const handlePageDetailChange = (e) => {
        const { name, value } = e.target;
        setPageDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleAddField = () => {
        setFields(prev => [...prev, { id: `temp_${Date.now()}`, field_name: '', field_label: '', field_type: 'text' }]);
    };

    const handleFieldChange = (index, prop, value) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [prop]: value };
        if (prop === 'field_label' && !newFields[index].field_name) {
            newFields[index].field_name = value.toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/\s+/g, '_');
        }
        setFields(newFields);
    };

    const handleRemoveField = (index) => {
        if (window.confirm('Are you sure you want to remove this field?')) {
            setFields(fields.filter((_, i) => i !== index));
        }
    };

    const handleSaveStructure = async () => {
        const cleanedFields = fields.map(field => {
            const { id, ...rest } = field;
            if (typeof rest.validation_rules === 'string') {
                try {
                    rest.validation_rules = JSON.parse(rest.validation_rules);
                } catch (e) {
                    toast.error(`Invalid JSON in validation rules for field: ${rest.field_label}`);
                    throw new Error("Invalid JSON");
                }
            }
            return rest;
        });

        // Create the final payload with updated page details and fields
        const payload = {
            ...pageConfig,
            ...pageDetails,
            fields: cleanedFields
        };

        try {
            const res = await api.updatePage(pageConfig._id, payload);
            setPageConfig(res.data.data); // Update the parent component's state
            await fetchPages(); // Refresh sidebar
            toast.success('Page structure updated!');
            setIsEditing(false);
        } catch (error) {
            if (error.message !== "Invalid JSON") {
                 toast.error(error.response?.data?.error || 'Failed to update structure.');
            }
        }
    };

    const handleDeletePage = async () => {
        if (window.confirm(`Are you sure you want to permanently delete the "${pageConfig.page_name}" page and all its data?`)) {
            try {
                await api.deletePage(pageConfig._id);
                await fetchPages();
                toast.success(`Page "${pageConfig.page_name}" deleted.`);
                navigate('/');
            } catch (error) {
                toast.error('Failed to delete page.');
            }
        }
    };

    return (
        <div className="admin-controls">
            <div className="admin-controls-header">
                <h3><SlidersHorizontal size={20} className="mr-2" /> Page Controls</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="btn-link">
                    {isEditing ? 'Done Editing' : 'Edit Page'}
                </button>
            </div>
            {isEditing && (
                <div className="admin-controls-body">
                    {/* Page Properties Editor */}
                    <div className="page-details-editor">
                        <h4>Page Properties</h4>
                        <div className="form-group">
                            <label>Page Name</label>
                            <input
                                name="page_name"
                                value={pageDetails.page_name}
                                onChange={handlePageDetailChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Page Description</label>
                            <textarea
                                name="page_description"
                                value={pageDetails.page_description}
                                onChange={handlePageDetailChange}
                                className="form-textarea"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Fields Editor */}
                    <h4 className="fields-header">Fields</h4>
                    {fields.map((field, index) => (
                        <FieldEditor
                            key={field.id || field._id}
                            field={field}
                            index={index}
                            onFieldChange={handleFieldChange}
                            onRemoveField={handleRemoveField}
                            pages={pages}
                            pageConfig={pageConfig}
                        />
                    ))}
                    <div className="flex justify-between items-center" style={{marginTop: '1rem'}}>
                        <button onClick={handleAddField} className="btn-link flex items-center"><Plus size={16} className="mr-1"/> Add Field</button>
                        <button onClick={handleSaveStructure} className="btn btn-success"><Save size={16} className="mr-1"/> Save Structure</button>
                    </div>
                    <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)'}}>
                         <button onClick={handleDeletePage} className="btn btn-danger" style={{width: '100%'}}>
                             <Trash2 size={16} className="mr-2"/> Delete This Page
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPageControls;
