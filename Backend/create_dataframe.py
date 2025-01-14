import pandas as pd
import requests
from bs4 import BeautifulSoup

headers = {"User-Agent": "adit29my@gmail.com"} 

def getCIKNumber(ticker, headers=headers):
    ticker = ticker.upper().replace(".", "-")
    ticker_json = requests.get(
        "https://www.sec.gov/files/company_tickers.json", headers=headers
    ).json()

    for company in ticker_json.values():
        if company["ticker"] == ticker:
            cik = str(company["cik_str"]).zfill(10)
            return cik
    raise ValueError(f"Ticker {ticker} not found in SEC database")

def getSubmissionData(ticker, headers=headers):
    cik = getCIKNumber(ticker)
    headers = headers
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    company_json = requests.get(url, headers=headers).json()
    
    return pd.DataFrame(company_json["filings"]["recent"])

def getFilteredFilings(ticker, form, headers=headers):
    company_filings_df = getSubmissionData(
        ticker, headers=headers
    )
    if (form=='ten_k'):
        df = company_filings_df[company_filings_df["form"] == "10-K"]
    elif (form=='ten_q'):
        df = company_filings_df[company_filings_df["form"] == "10-Q"]
    
    df = df.set_index("reportDate")
    accession_df = df["accessionNumber"]
    return accession_df    

def getFacts(ticker, headers=headers):
    cik = getCIKNumber(ticker)
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    company_facts = requests.get(url, headers=headers).json()
    return company_facts

def getFactsDF(ticker, headers=headers):
    facts = getFacts(ticker, headers)
    us_gaap_data = facts["facts"]["us-gaap"]
    df_data = []
    for fact, details in us_gaap_data.items():
        for unit in details["units"]:
            for item in details["units"][unit]:
                row = item.copy()
                row["fact"] = fact
                df_data.append(row)

    df = pd.DataFrame(df_data)
    df["end"] = pd.to_datetime(df["end"])
    df["start"] = pd.to_datetime(df["start"])
    df = df.drop_duplicates(subset=["fact", "end", "val"])
    df.set_index("end", inplace=True)
    labels_dict = {fact: details["label"] for fact, details in us_gaap_data.items()}
    return df, labels_dict

def getAnnualFacts(ticker, headers=headers):
    accession_nums = getFilteredFilings(ticker, form='ten_k')
    df, label_dict = getFactsDF(ticker, headers)
    ten_k = df[df["accn"].isin(accession_nums)]
    ten_k = ten_k[ten_k.index.isin(accession_nums.index)]
    pivot = ten_k.pivot_table(values="val", columns="fact", index="end")
    pivot.rename(columns=label_dict, inplace=True)
    return pivot.T

def getQuarterlyFacts(ticker, headers=headers):
    accession_nums = getFilteredFilings(ticker, form='ten_q')
    df, label_dict = getFactsDF(ticker, headers)
    ten_q = df[df["accn"].isin(accession_nums)]
    ten_q = ten_q[ten_q.index.isin(accession_nums.index)].reset_index(drop=False)
    ten_q = ten_q.drop_duplicates(subset=["fact", "end"], keep="last")
    pivot = ten_q.pivot_table(values="val", columns="fact", index="end")
    pivot.rename(columns=label_dict, inplace=True)
    return pivot.T

def getHistoricalData(ticker):
    quarterlyDF = getQuarterlyFacts(ticker)
    annualDF = getAnnualFacts(ticker)

    # Step 1: Find common rows
    common_indices = quarterlyDF.index.intersection(annualDF.index)

    # Step 2: Subset DataFrames to common rows
    Df1_common = quarterlyDF.loc[common_indices]
    Df2_common = annualDF.loc[common_indices]

    # Step 3: Combine the two DataFrames
    combined_df = pd.concat([Df1_common, Df2_common], axis=1)

    # Step 4: Sort the columns by date
    combined_df = combined_df.reindex(sorted(combined_df.columns), axis=1)

    return combined_df

def addColumns(df, ratioDictionary):
    for col_name, (required_cols, operation) in ratioDictionary.items():
        if all(col in df.columns for col in required_cols):
            df[col_name] = operation(df)
        else:
            print(f"Skipping '{col_name}': Missing required columns {required_cols}.")
    return df

def calculateRatios(dataDf):
    
    df = pd.DataFrame(dataDf).T
    # df.index = pd.to_datetime(df.index)

    if 'Revenue, Net (Deprecated 2018-01-31)' in df.columns:
        df['Effective Revenue'] = df['Revenue, Net (Deprecated 2018-01-31)'].fillna(df['Revenue from Contract with Customer, Excluding Assessed Tax'])
    else:
        df['Effective Revenue'] = df['Revenue from Contract with Customer, Excluding Assessed Tax']
    
    df['Operating Margin Ratio'] = df['Operating Income (Loss)'] / df['Effective Revenue']
    ratioDictionary = {
        'Gross Margin Ratio': (['Gross Profit', 'Effective Revenue'], lambda df: df['Gross Profit'] / df['Effective Revenue']),
        'Operating Margin Ratio': (['Operating Income (Loss)', 'Effective Revenue'], lambda df: df['Operating Income (Loss)'] / df['Effective Revenue']),
        'Net Profit Margin Ratio': (['Net Income (Loss) Attributable to Parent', 'Effective Revenue'], lambda df: df['Net Income (Loss) Attributable to Parent'] / df['Effective Revenue']),
        'Return on Assets Ratio': (['Net Income (Loss) Attributable to Parent', 'Assets'], lambda df: df['Net Income (Loss) Attributable to Parent'] / df['Assets']),
        'Return on Equity Ratio': (['Net Income (Loss) Attributable to Parent', 'Stockholders\' Equity Attributable to Parent'], lambda df: df['Net Income (Loss) Attributable to Parent'] / df['Stockholders\' Equity Attributable to Parent']),
        'Current Ratio': (['Assets, Current', 'Liabilities, Current'], lambda df: df['Assets, Current'] / df['Liabilities, Current']),
        'Quick Ratio': (['Assets, Current', 'Inventory, Net', 'Liabilities, Current'], lambda df: df['Assets, Current'] - df['Inventory, Net'] / df['Liabilities, Current']),
        'Cash Ratio': (['Cash and Cash Equivalents, at Carrying Value', 'Liabilities, Current'], lambda df: df['Cash and Cash Equivalents, at Carrying Value'] / df['Liabilities']),
        'Debt to Equity (D/E) Ratio': (['Liabilities', 'Stockholders\' Equity Attributable to Parent'], lambda df: df['Liabilities'] / df['Stockholders\' Equity Attributable to Parent']),
        'Debt to Assets Ratio': (['Liabilities', 'Assets'], lambda df: df['Liabilities'] / df['Assets']),
        'Interest Coverage Ratio': (['Operating Income (Loss)', 'Interest Expense'], lambda df: df['Operating Income (Loss)'] / df['Interest Expense']),
        'Equity Ratio': (['Stockholders\' Equity Attributable to Parent', 'Assets'], lambda df: df['Stockholders\' Equity Attributable to Parent'] / df['Assets']),
        'Asset Turnover Ratio': (['Effective Revenue', 'Assets'], lambda df: df['Effective Revenue'] / df['Assets']),
        'Inventory Turnover Ratio': (['Cost of Goods and Services Sold', 'Inventory, Net'], lambda df: df['Cost of Goods and Services Sold'] / df['Inventory, Net']),
        'Receivables Turnover Ratio': (['Effective Revenue', 'Accounts Receivable, after Allowance for Credit Loss, Current'], lambda df: df['Effective Revenue'] / df['Accounts Receivable, after Allowance for Credit Loss, Current']),
        'Days Sales outstanding': (['Receivables Turnover Ratio'], lambda df: 365 / df['Receivables Turnover Ratio']),
        'Days Inventory outstanding': (['Inventory Turnover Ratio'], lambda df: 365 / df['Inventory Turnover Ratio']),
        'Payables Turnover Ratio': (['Cost of Goods and Services Sold', 'Accounts Payable, Current'], lambda df: df['Cost of Goods and Services Sold'] / df['Accounts Payable, Current']),
        'Operating Cash Flow Ratio': (['Net Cash Provided by (Used in) Operating Activities, Continuing Operations', 'Liabilities'], lambda df: df['Net Cash Provided by (Used in) Operating Activities, Continuing Operations'] / df['Liabilities']),
        'Capital Expenditure Coverage Ratio': (['Net Cash Provided by (Used in) Operating Activities, Continuing Operations', 'Payments to Acquire Property, Plant, and Equipment'], lambda df: df['Net Cash Provided by (Used in) Operating Activities, Continuing Operations'] / df['Payments to Acquire Property, Plant, and Equipment']),        
    }

    df_with_ratios = addColumns(df, ratioDictionary)    
    
    return df_with_ratios.T


def makeCompanyDataframe(ticker):
    historical_data_df = getHistoricalData(ticker)
    enhanced_df = calculateRatios(historical_data_df)

    # Convert column names to strings
    enhanced_df.columns = enhanced_df.columns.astype(str)

    # Convert all timestamp cells to strings
    enhanced_df = enhanced_df.applymap(lambda x: str(x) if isinstance(x, pd.Timestamp) else x)
    
    enhanced_df = enhanced_df.reset_index()
    
    return enhanced_df

    