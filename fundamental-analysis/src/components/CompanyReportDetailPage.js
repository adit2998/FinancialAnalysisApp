import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const CompanyReportDetailPage = () => {
  // Placeholder values for the cards
  const cardData = [
    { title: 'Card 1', text: 'This is a placeholder card for company 1.' },
    { title: 'Card 2', text: 'This is a placeholder card for company 2.' },
  ];

  return (
    <div className="container mt-4">
      <Row xs={1} md={2} lg={3} xl={5} className="g-4">
        {cardData.map((card, index) => (
          <Col key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
                <Button variant="primary">Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CompanyReportDetailPage;