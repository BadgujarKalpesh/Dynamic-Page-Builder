import { Edit, Trash2 } from 'lucide-react';

const DynamicTable = ({ fields, data, onEdit, onDelete }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500" style={{padding: '2rem 0'}}>No data available. Add a new item to get started.</p>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {fields.map(field => (
                            <th key={field._id}>{field.field_label}</th>
                        ))}
                        <th><span style={{display: 'none'}}>Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item._id}>
                            {fields.map(field => (
                                <td key={field._id}>
                                    {field.field_type === 'checkbox'
                                        ? (item[field.field_name] ? 'Yes' : 'No')
                                        : field.field_type === 'date'
                                        ? formatDate(item[field.field_name])
                                        : String(item[field.field_name] ?? '')
                                    }
                                </td>
                            ))}
                            <td className="actions-cell">
                                <button onClick={() => onEdit(item)} className="edit-btn" title="Edit">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => onDelete(item._id)} className="delete-btn" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
