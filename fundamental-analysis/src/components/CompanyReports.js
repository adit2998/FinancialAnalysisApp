import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const CompanyReportsPage = () => {
  const { ticker } = useParams();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`/api/reports/${ticker}/reports_list`);
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReports();
  }, [ticker]);

  if (error) {
    return <div className="container mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Reports for {ticker.toUpperCase()}</h2>
      <Row>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          reports.map((filename, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{filename}</Card.Title>
                  <Card.Text>
                    {/* You can add additional report metadata here if available */}
                    Report for fiscal period or type: <strong>{filename}</strong>
                  </Card.Text>
                  <Link to={`/company/${ticker}/reports/${filename}`}>
                    <Button variant="primary">View Report</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default CompanyReportsPage;