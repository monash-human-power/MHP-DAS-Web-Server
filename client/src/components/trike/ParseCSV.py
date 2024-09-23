from csv import DictReader
from json import dump

def parseCSV(filePath: str, *fields: str) -> list[tuple[float, float]]:
    """
    :filePath: location of the .csv file
    :*fields: allows only certain fields to be included 
    """
    with open(filePath, 'r') as csvFile:
        dictData = DictReader(csvFile)

        # Default behaviour if invalid or no fields are provided
        if not fields:
            fields = dictData.fieldnames 

        return [tuple(row[f] for f in fields) for row in dictData]
    
def writeTuplesToJson(filePath: str, tuples: list[tuple]) -> None:
    with open(filePath, 'w') as f:
        dump(tuples, f)

caseyTuples = parseCSV("CaseyGPSData.csv", "LATITUDE", "LONGITUDE")
writeTuplesToJson("CaseyLatLngTuple.json", caseyTuples)

