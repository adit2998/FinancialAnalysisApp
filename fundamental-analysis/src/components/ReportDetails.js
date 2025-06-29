import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const ReportDetailsPage = () => {
  const { ticker, filename } = useParams();
  const [sections, setSections] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report_details/${ticker}/report/${filename}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        setSections(data.sections);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReport();
  }, [ticker, filename]);

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Report Details: {filename}</h2>
      {Object.entries(sections).map(([sectionTitle, content], index) => (
        <Card className="mb-3" key={index}>
          <Card.Header><strong>{sectionTitle}</strong></Card.Header>
          <Card.Body>
            <Card.Text>{content}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ReportDetailsPage;