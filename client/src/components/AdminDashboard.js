import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const AdminDashboard = () => {
    const [pageName, setPageName] = useState('');
    const [pageDescription, setPageDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const { fetchPages } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pageName || !pageDescription) {
            return toast.warn('Please fill in all fields.');
        }
        setLoading(true);

        const route = `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
        const table_name = `table_${pageName.toLowerCase().replace(/\s+/g, '_')}`;

        try {
            const newPage = { page_name: pageName, page_description: pageDescription, route, table_name };
            const res = await api.createPage(newPage);
            toast.success(`Page "${res.data.data.page_name}" created successfully!`);
            await fetchPages();
            navigate(res.data.data.route);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create page.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 className="text-2xl font-bold">Create a New Dynamic Page</h2>
            <p className="text-gray-500" style={{marginBottom: '1.5rem'}}>Define the basic properties of your new page.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="pageName">Page Name</label>
                    <input
                        type="text"
                        id="pageName"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        placeholder="e.g., Products, Employees"
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pageDescription">Page Description</label>
                    <textarea
                        id="pageDescription"
                        value={pageDescription}
                        onChange={(e) => setPageDescription(e.target.value)}
                        placeholder="A short description of what this page is for."
                        rows="3"
                        className="form-textarea"
                        required
                    ></textarea>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Creating...' : 'Create Page'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default AdminDashboard;
