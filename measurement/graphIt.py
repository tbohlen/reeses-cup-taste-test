#! /usr/bin/env pythonw

from matplotlib import pyplot
import math, sys

def importData(fileName):

    print 'Importing measurement....'

    with open(fileName) as f:
        content = f.readlines()
        f.close()

    infoLine = content.pop(0).split()
    data = []
    for line in content:
        lineList = line.split()
        lineDict = {infoLine[0]:lineList[0]}
        for i in range(1, len(lineList)):
            lineDict[infoLine[i]] = float(lineList[i])
        data.append(lineDict)

    return data

def calculateVolumes(data):
    """
    Takes the data file format and returns a list of name mapped to a tuple of
    chocolate, peanut butter, and total density.
    """
    print "Calculating volumes..."
    results = {}
    for dataLine in data:
        name = dataLine['name']
        r1 = dataLine['r1']
        r2 = dataLine['r2']
        r3 = dataLine['r3']
        r4 = dataLine['r4']
        t1 = dataLine['t1']
        t2 = dataLine['t2']
        t3 = dataLine['t3']
        volCup = (math.pi/3.0) * t1 * ((r1**2) + (r4**2) - (r1*r4))
        volPeanut = math.pi * (t1 - t2 - t3) * ((r2**2) + (r3**2) - (r2*r3)) / 3.0
        volChoc = volCup - volPeanut
        ratio = volChoc/volPeanut
        print "Ratio for " + name + " is " + str(ratio)
        results[name] = [r1, volChoc, volPeanut, volCup, ratio]
    return results

def formatLines(volumes):
    """
    takes volume data as input and spits out a list of three lists, chocolate,
    peanut butter, and total volume. Each list is organized by the radius of the
    cup.

    TODO: actually test to make sure these are in increasing radius order
    """
    print "Processing data...."

    results = [[], [], [], [], []]
    for vol in volumes:
        results[0].append(volumes[vol][0])
        results[1].append(volumes[vol][1])
        results[2].append(volumes[vol][2])
        results[3].append(volumes[vol][3])
        results[4].append(volumes[vol][4])
    print "is " + str(results[0])
    return results

def main(argV=None):
    if argV == None:
        argV = sys.argv
    dataFile = argV[1]
    if dataFile == None:
        dataFile = './data.txt'

    data = importData(dataFile)
    volumes = calculateVolumes(data)
    lines = formatLines(volumes)

    pyplot.xlabel("Radius")
    pyplot.ylabel("Volume")
    pyplot.plot(lines[0], lines[1], "ro")
    pyplot.plot(lines[0], lines[2], "go")
    pyplot.plot(lines[0], lines[3], "bo")
    pyplot.plot(lines[0], lines[4], "yo")
    pyplot.show()

if __name__ == "__main__":
    main()
