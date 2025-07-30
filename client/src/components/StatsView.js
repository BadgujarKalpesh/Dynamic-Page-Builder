import { BarChart2 } from 'lucide-react';

const StatsView = ({ pageConfig, data }) => {
    const statsFields = pageConfig.fields.filter(f => f.is_used_for_stats);
    if (statsFields.length === 0) return null;

    const stats = statsFields.map(field => {
        const values = data.map(item => parseFloat(item[field.field_name])).filter(v => !isNaN(v));
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = values.length > 0 ? sum / values.length : 0;
        return {
            label: field.field_label,
            sum: sum,
            avg: avg,
        };
    });

    return (
        <div className="card">
            <h3 className="font-bold flex items-center" style={{fontSize: '1.125rem', marginBottom: '0.75rem'}}><BarChart2 size={20} className="mr-2" /> Statistics</h3>
            <div className="stats-grid">
                {stats.map(stat => (
                    <div key={stat.label} className="stat-card">
                        <p className="stat-label">{stat.label}</p>
                        <p className="stat-value">
                            {stat.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        <p className="stat-avg">
                            Avg: {stat.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                ))}
                <div className="stat-card total-records">
                    <p className="stat-label">Total Records</p>
                    <p className="stat-value">{data.length}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsView;