from csv import DictReader
from json import dump

def parseLatLngTuple(filePath: str) -> list[tuple[float, float]]:
    with open(filePath, 'r') as csvFile:
        dictData = DictReader(csvFile)

        return [(row["LATITUDE"], row["LONGITUDE"]) for row in dictData]

def writeTuplesToJson(filePath: str, tuples: list[tuple]) -> None:
    with open(filePath, 'w') as f:
        dump(tuples, f)

caseyTuples = parseLatLngTuple("CaseyGPSData.csv")
writeTuplesToJson("CaseyLatLngTuple.json", caseyTuples)