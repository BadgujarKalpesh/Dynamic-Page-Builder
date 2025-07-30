import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import Modal from './common/Modal';
import AdminPageControls from './AdminPageControls';
import StatsView from './StatsView';
import DynamicTable from './DynamicTable';
import DynamicForm from './DynamicForm';
import Spinner from './common/Spinner';

const DynamicPage = () => {
    const { pageRoute } = useParams();
    const { pages, role, fetchPages } = useContext(AppContext);

    const [pageConfig, setPageConfig] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    
    // State for pagination
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // --- NEW: State for inline header editing ---
    const [isHeaderEditing, setIsHeaderEditing] = useState(false);
    const [pageDetails, setPageDetails] = useState({ page_name: '', page_description: '' });

    const fetchPageData = useCallback(async (config, page) => {
        if (!config) return;
        setLoading(true);
        try {
            const res = await api.getData(config.table_name, page);
            setData(res.data.data);
            setPagination(res.data.pagination);
        } catch (error) {
            toast.error(`Failed to fetch data for ${config.page_name}.`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const currentPageConfig = pages.find(p => p.route === `/${pageRoute}`);
        if (currentPageConfig) {
            setPageConfig(currentPageConfig);
            // Populate local state for header editing
            setPageDetails({
                page_name: currentPageConfig.page_name,
                page_description: currentPageConfig.page_description
            });
            fetchPageData(currentPageConfig, currentPage);
        }
    }, [pageRoute, pages, fetchPageData, currentPage]);

    const handleSave = async (formData) => {
        try {
            if (editingItem) {
                await api.updateData(pageConfig.table_name, editingItem._id, formData);
            } else {
                await api.createData(pageConfig.table_name, formData);
            }
            toast.success('Item saved successfully!');
            setShowFormModal(false);
            setEditingItem(null);
            fetchPageData(pageConfig, currentPage);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save item.');
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.deleteData(pageConfig.table_name, itemId);
                toast.success('Item deleted successfully!');
                fetchPageData(pageConfig, currentPage);
            } catch (error) {
                toast.error('Failed to delete item.');
            }
        }
    };
    
    const handleEdit = (item) => {
        setEditingItem(item);
        setShowFormModal(true);
    };

    // --- NEW: Handlers for inline header editing ---
    const handlePageDetailChange = (e) => {
        const { name, value } = e.target;
        setPageDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePageDetails = async () => {
        try {
            const payload = { ...pageConfig, ...pageDetails };
            const res = await api.updatePage(pageConfig._id, payload);
            setPageConfig(res.data.data); // Update this page's config
            await fetchPages(); // Refresh the sidebar
            toast.success('Page details updated!');
            setIsHeaderEditing(false);
        } catch (error) {
            toast.error('Failed to update page details.');
        }
    };

    if (!pageConfig) {
        return <Spinner />;
    }

    const searchFields = pageConfig.fields.filter(f => f.is_used_for_search);
    const filteredData = data.filter(item => {
        if (!searchTerm) return true;
        return searchFields.some(field =>
            item[field.field_name] && String(item[field.field_name]).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="page-header">
                    {isHeaderEditing && role === 'Admin' ? (
                        <div className="page-header-edit">
                            <input
                                name="page_name"
                                value={pageDetails.page_name}
                                onChange={handlePageDetailChange}
                                className="form-input"
                            />
                            <textarea
                                name="page_description"
                                value={pageDetails.page_description}
                                onChange={handlePageDetailChange}
                                className="form-textarea"
                                rows="2"
                            />
                            <div className="page-header-edit-actions">
                                <button onClick={() => setIsHeaderEditing(false)} className="btn btn-secondary">Cancel</button>
                                <button onClick={handleSavePageDetails} className="btn btn-success">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2>{pageConfig.page_name}</h2>
                            <p>{pageConfig.page_description}</p>
                        </div>
                    )}
                </div>
                {role === 'Admin' && (
                    <div className="page-header-actions">
                        {!isHeaderEditing && (
                             <button onClick={() => setIsHeaderEditing(true)} className="btn btn-secondary flex items-center">
                                <Edit size={16} className="mr-2"/> Edit Details
                             </button>
                        )}
                        <AdminPageControls pageConfig={pageConfig} setPageConfig={setPageConfig} />
                    </div>
                )}
            </div>

            <StatsView pageConfig={pageConfig} data={data} />

            <div className="card">
                <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                    {searchFields.length > 0 && (
                        <div style={{position: 'relative'}}>
                           <Search style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} size={18}/>
                           <input
                                type="text"
                                placeholder={`Search...`}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="form-input"
                                style={{paddingLeft: '35px', width: '320px'}}
                            />
                        </div>
                    )}
                    <button onClick={() => { setShowFormModal(true); setEditingItem(null); }} className="btn btn-primary">
                        <Plus size={16} className="mr-2" /> Add New
                    </button>
                </div>

                {loading ? <Spinner /> : (
                    <>
                        <DynamicTable fields={pageConfig.fields} data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />
                        {pagination && pagination.pages > 1 && (
                            <div className="flex justify-between items-center" style={{marginTop: '1rem'}}>
                                <span>Page {pagination.page} of {pagination.pages}</span>
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={pagination.page === 1} className="btn btn-secondary">Previous</button>
                                    <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={pagination.page === pagination.pages} className="btn btn-secondary">Next</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); setEditingItem(null); }} title={editingItem ? `Edit Item` : `Add New Item`}>
                <DynamicForm fields={pageConfig.fields} initialData={editingItem} onSave={handleSave} onCancel={() => { setShowFormModal(false); setEditingItem(null); }} />
            </Modal>
        </div>
    );
};

export default DynamicPage;
