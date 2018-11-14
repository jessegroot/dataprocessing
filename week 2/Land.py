#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579
"""
This script makes a histogram of all the lands in the world containing GDP ($ per capita) dollars
It also makes a BoxPlot of the Infant mortality per 1000 births
"""#PEP 8 Style Guide

import pandas as pd
import csv
import statistics
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json

INPUT_CSV = "input.csv"
amoundOfBins = 20

def getDataCSV():
    # make dict for json, and array for Hist and BoxPlot
    lands = {}
    GDP = []
    infant = []
    # open CSV file
    with open(INPUT_CSV) as csvfile:
        # make reader of the CSV file
        lineReader = csv.DictReader(csvfile)
        # lees elke row
        for row in lineReader:
            # make array with all the needed values and take only the needed data
            land = ([row['Country'],
            row['Region'].rstrip(),
            row['Pop. Density (per sq. mi.)'],
            row['Infant mortality (per 1000 births)'].replace(',','.'),
            ''.join(filter(str.isdigit, row['GDP ($ per capita) dollars']))])

            # for missing data fill N/A (land always present)
            for item in range(1,5):
                if land[item] == "" or land[item] == "unknown":
                    land[item] = 'N/A'

            # make dict for json
            lands[land[0]] = ({'Region': land[1],
            'Pop. Density (per sq. mi.)': land[2],
            'Infant mortality (per 1000 births)': land[3],
            'GDP ($ per capita) dollars': land[4]})

            # make the 2 arrays with the usefull data for graphs
            if  land[4] != "N/A":
                GDP.append(int(land[4]))
            if land[3] != "N/A":
                infant.append(float(land[3]))

    # return the dict and arrays
    return [lands, GDP, infant]

def makeHist(GDP):
    # calculate the mean en sd for the 99% interval (filtering outliers)
    mean = statistics.mean(GDP)
    sd = statistics.stdev(GDP)
    # throw away data outside the 99% interval
    GDP_Final = [x for x in GDP if (x > mean - 3 * sd and x < mean + 3 * sd)]

    # print data for exercise
    print("This involves the data of GDP")
    print("the mean is", statistics.mean(GDP_Final))
    print("the mode is", max(set(GDP_Final), key=GDP_Final.count))
    print("the median is", statistics.median(GDP_Final))

    #Create the bins for the histogram
    binJump = int((GDP_Final[-1]-GDP_Final[0])/amoundOfBins)
    bins = [GDP_Final[0]+bin*binJump for bin in range(0,amoundOfBins+1)]

    #plot hist with the values and bins.
    plt.hist(GDP_Final, bins, histtype='bar', rwidth=0.9)
    plt.ylabel('Lands')
    plt.xlabel('GDP ($ per capita) dollars')
    plt.title('Display of the amound of lands with GDP in dollars')
    plt.show()
    return

def makeBoxplot(infant):
    # print data for exercise
    print("THe underlying involves the infant mortality")
    print("The Minimum is", infant[0])
    print("The First Quartile is", np.percentile(infant, 25))
    print("The Median is", np.percentile(infant, 50))
    print("The Third Quartile is", np.percentile(infant, 75))
    print("The Maximum is", infant[-1])

    # create boxplot with title
    ax = sns.boxplot(infant).set_title("Infant mortality (per 1000 births), around the world")
    plt.show()

if __name__ == "__main__":

    # get data and visualize data with panda.
    data = getDataCSV()
    df = pd.DataFrame(data[0])

    # call the programs to make the plots
    makeHist(sorted(data[1]))
    makeBoxplot(sorted(data[2]))

    # write json
    with open('data.json', 'w') as outfile:
        json.dump(data[0], outfile)
