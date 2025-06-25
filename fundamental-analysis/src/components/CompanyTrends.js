import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CompanyTrends = () => {
  const { ticker } = useParams();
  const [financials, setFinancials] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch(`/api/financials/${ticker}/trends`);
        if (!response.ok) throw new Error('Failed to fetch trends');
        const data = await response.json();
        setFinancials(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrends();
  }, [ticker]);

  if (error) return <div>Error: {error}</div>;
  if (!Object.keys(financials).length) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Financial Trends for {ticker.toUpperCase()}</h2>
      {Object.entries(financials).map(([metricName, series]) => (
        <div key={metricName} style={{ marginBottom: '3rem' }}>
          <h4>{metricName}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(d) => String(d).slice(2)} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default CompanyTrends;