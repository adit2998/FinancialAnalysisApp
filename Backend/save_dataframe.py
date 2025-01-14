from create_dataframe import makeCompanyDataframe
from pymongo import MongoClient
import pandas as pd

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  
db = client['deepValDb']
collection = db['historical_financials']


def save_dataframe_to_csv(ticker):
    historical_financials_df = makeCompanyDataframe(ticker)
    historical_financials_df.to_csv('test.csv', index=True)

def save_dataframe_to_db(ticker, collection):
    historical_financials_df = makeCompanyDataframe(ticker)   
    financials_data = historical_financials_df.to_dict(orient='records')
    
    # Create the document structure
    document = {
        "ticker": ticker,
        "financials": financials_data
    }

    # Insert the document into the collection
    collection.insert_one(document)
    print(f"Data for ticker '{ticker}' has been saved to MongoDB.")


def load_collection_to_dataframe(ticker, collection):
    # Find the document for the given ticker
    document = collection.find_one({"ticker": ticker})
    
    if not document:
        raise ValueError(f"No data found for ticker: {ticker}")
    
    # Extract the 'financials' field and convert to DataFrame
    financials_data = document.get("financials", [])
    dataframe = pd.DataFrame(financials_data)
    
    dataframe.to_csv('extracted.csv', index=True)


# Test run
# save_dataframe_to_db('aapl', collection)

# load_collection_to_dataframe('aapl', collection)
