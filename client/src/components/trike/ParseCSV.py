from csv import DictReader
from json import dump

def parseCSV(filePath: str, *fields: str) -> list[tuple[float, float]]:
    """
    :filePath: location of the .csv file
    :*fields: allows only certain fields to be included 
    """
    with open(filePath, 'r') as csvFile:
        dictData = DictReader(csvFile)

        # [print(f) for f in dictData.fieldnames]

        # Default behaviour if invalid or no fields are provided
        if not fields:
            fields = dictData.fieldnames 

        return [tuple(row[f] for f in fields) for row in dictData]
    
def writeTuplesToJson(filePath: str, tuples: list[tuple]) -> None:
    with open(filePath, 'w') as f:
        dump(tuples, f)

def isIncreasing(numbers: list[int]) -> bool:
    return all(numbers[i] > numbers[i - 1] for i in range(1, len(numbers)))


caseyTuples = parseCSV("CaseyGPSData.csv", "LATITUDE", "LONGITUDE")
power1 = parseCSV("CaseyGPSData.csv", "time")
power2 = parseCSV("CaseyGPSData.csv", "TIME_TOTAL")
print(power1[0], power1[-1]) 
print(power2[0], power2[-1])
# [print(p[0]) for p in power2]

distAndTime = parseCSV("CaseyGPSData.csv", "DISTANCE_m", "TIME_TOTAL")


def calculateSpeed(distAndTime: list[tuple]) -> list[float]:
    speeds = []

    for i in range(1, len(distAndTime)):
        dist1, time1 = distAndTime[i - 1]
        dist2, time2 = distAndTime[i]

        time_diff = float(time2) - float(time1)

        distance_diff = float(dist2) - float(dist1)

        if time_diff > 0:
            speed = distance_diff / time_diff
        else:
            speed = 0  # In case of zero time difference

        speeds.append(speed)

    return speeds

speeds = calculateSpeed(distAndTime)

writeTuplesToJson("CaseyLatLngTuple.json", caseyTuples)
writeTuplesToJson("CaseySpeeds.json", speeds)