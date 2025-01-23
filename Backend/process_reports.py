import fitz
import re
import pymongo
import gridfs

def open_document(mongo_uri, db_name, filename):
     # Connect to MongoDB
    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]
    
    # Access GridFS collection
    fs = gridfs.GridFS(db)
    
    # Retrieve the file from GridFS by filename
    pdf_file = fs.find_one({"filename": filename})
    
    if pdf_file is None:
        raise FileNotFoundError(f"File with filename '{filename}' not found in the database.")
    
    # Read the binary data of the PDF
    pdf_data = pdf_file.read()
    
    # Open the PDF document using fitz
    document = fitz.open(stream=pdf_data, filetype="pdf")

    return document

def extract_headers(document):
    # Extract headers
    text = ""

    # Extract text from the first few pages (TOC is usually at the beginning)
    for page_num in range(min(10, len(document))):  # Check first 10 pages
        text += document[page_num].get_text()    

    # Identify potential TOC entries using regex
    toc_pattern = re.compile(r"(Item\s\d+[A-Z]*\.\s+.+?)\s+\d{1,4}", re.MULTILINE)
    matches = toc_pattern.findall(text)

    # Clean up and store results
    toc = [match.strip() for match in matches]
    headers = [re.sub(r'^Item \d+[A-Z]?\.\n', '', item) for item in toc]

    return headers

def extract_section(document, section_heading):
    """
    Extracts text from a specific section of a PDF.

    :param pdf_path: Path to the PDF file.
    :param section_heading: The heading of the section to extract.
    :return: Extracted text from the specified section.
    """
    try:                
        full_text = ""
        
        # Extract text from all pages
        for page_num in range(len(document)):
            page = document[page_num]
            full_text += page.get_text()

        # Normalize text and split into lines
        lines = full_text.split("\n")
        section_text = []
        capture = False
        
        # Normalize section_heading (allow spaces between "Item x." and header)
        normalized_heading = re.sub(r'\s+', ' ', section_heading.strip())  # Collapse multiple spaces
        
        for line in lines:
            # Use regex to find the Item x. format with varying spaces
            if re.search(rf"Item\s*[\dA-Z]+\.\s*{re.escape(normalized_heading)}", line, re.IGNORECASE):
                capture = True  # Start capturing text
            elif capture and line.strip().isupper():  # New heading detected
                break
            elif capture:
                section_text.append(line.strip())
        
        return "\n".join(section_text) if section_text else "Section not found."
    
    except Exception as e:
        return f"Error: {str(e)}"


def extract_content(mongo_uri, db_name, filename):
    
    document = open_document(mongo_uri, db_name, filename)
    headers = extract_headers(document)

    info_dict = {
        'file_name': filename
    }
    
    for header in headers:
        info_dict[header] = extract_section(document, header)        

    document.close()

    return info_dict



# Example usage
mongo_uri = "mongodb://localhost:27017"
db_name = "financial_reports"
filename = "aapl_10-K_report.pdf"

report_content = extract_content(mongo_uri, db_name, filename)
# print(content['Business'])



def write_dict_to_mongo(mongo_uri, db_name, collection_name, data_dict):
    """
    Writes a dictionary as a single document into a MongoDB collection.
    
    Parameters:
        mongo_uri (str): The MongoDB connection URI.
        db_name (str): The name of the database.
        collection_name (str): The name of the collection.
        data_dict (dict): The dictionary to write as a document.
    
    Returns:
        str: The ID of the inserted document.
    """
    if not isinstance(data_dict, dict):
        raise ValueError("The data must be a dictionary.")
    
    # Connect to MongoDB
    client = pymongo.MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]
    
    # Insert the dictionary into the collection
    result = collection.insert_one(data_dict)
    
    # Return the ID of the inserted document
    return str(result.inserted_id)


mongo_uri = "mongodb://localhost:27017"
db_name = "deepValDb"
collection_name = "report_info"

print('New entry created: ', write_dict_to_mongo(mongo_uri, db_name, collection_name, report_content))