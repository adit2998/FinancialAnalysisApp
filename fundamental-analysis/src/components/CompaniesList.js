import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const TickersList = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tickers from your backend API
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch tickers');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCompanies();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Companies List</h2>
      <Row>
        {companies.map((company) => (
          <Col md={4} key={company.ticker} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>
                  {/* Add any additional information here */}                  
                  <p>{company.sicDescription}</p>
                </Card.Text>
                <Link to={`/company/${company.ticker}/trends`}>
                  <Button variant="primary">View trends</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TickersList;