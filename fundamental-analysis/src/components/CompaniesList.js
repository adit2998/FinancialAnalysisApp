// import React from 'react';
// import { Card, Button, Row, Col } from 'react-bootstrap';

// const CompaniesListPage = () => {
//   // Placeholder values for the cards
//   const cardData = [
//     { title: 'Card 1', text: 'This is a placeholder card for company 1.' },
//     { title: 'Card 2', text: 'This is a placeholder card for company 2.' },
//     { title: 'Card 3', text: 'This is a placeholder card for company 3.' },
//     { title: 'Card 4', text: 'This is a placeholder card for company 4.' },    
//   ];

//   return (
//     <div className="container mt-4">
//       <Row xs={1} md={2} lg={3} xl={5} className="g-4">
//         {cardData.map((card, index) => (
//           <Col key={index}>
//             <Card>
//               <Card.Body>
//                 <Card.Title>{card.title}</Card.Title>
//                 <Card.Text>{card.text}</Card.Text>
//                 <Button variant="primary">Go somewhere</Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default CompaniesListPage;




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
                <Link to={`/company/${ticker}`}>
                  <Button variant="primary">Go to Company</Button>
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