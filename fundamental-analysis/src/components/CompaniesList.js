import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const TickersList = () => {
  const [tickers, setTickers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tickers from your backend API
    const fetchTickers = async () => {
      try {
        const response = await fetch('/api/tickers');
        if (!response.ok) {
          throw new Error('Failed to fetch tickers');
        }
        const data = await response.json();
        setTickers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTickers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Companies List</h2>
      <Row>
        {tickers.map((ticker) => (
          <Col md={4} key={ticker} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{ticker.toUpperCase()}</Card.Title>
                <Card.Text>
                  {/* Add any additional information here */}
                  <p>Details about {ticker}</p>
                </Card.Text>
                <Link to={`/company/${ticker}/trends`}>
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