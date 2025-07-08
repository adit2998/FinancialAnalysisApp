const express = require('express');
const cors = require('cors');

const companiesRouter = require('./routes/companies');
const financialsRouter = require('./routes/financials');
const reportsRouter = require('./routes/reports');
const reportDetailsRouter = require('./routes/report_details');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/companies', companiesRouter);
app.use('/api/financials', financialsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/report_details', reportDetailsRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));