import { useParams } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";

const CompanyTrendsPage = () => {
    const { ticker } = useParams();
    const companyDetails = {
      name: "Example Corp",
      sector: "Technology",
      marketCap: "500B",
      description: "A leading provider of innovative tech solutions.",
    };
  
    return (
      <div>      
      {/* Company Info Section */}
      <Container className="mt-4">
        <h1>{companyDetails.name} ({ticker})</h1>
        <p className="lead">{companyDetails.description}</p>
        <p><strong>Sector:</strong> {companyDetails.sector}</p>
        <p><strong>Market Cap:</strong> {companyDetails.marketCap}</p>
      </Container>
    </div>
    );
}

export default CompanyTrendsPage;