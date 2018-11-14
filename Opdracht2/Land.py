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
            lands[land[0]] = land[1], land[2], land[3], land[4]

            # make the 2 arrays with the usefull data
            if  land[4] != "N/A":
                GDP.append(int(land[4]))
            if land[3] != "N/A":
                infant.append(float(land[3]))

    # return the dict and arrays
    return [lands, GDP, infant]

def makeHist(GDP):
    # calculate the mean en sd for the 95% interval (filtering outliers)
    mean = statistics.mean(GDP)
    sd = statistics.stdev(GDP)
    # throw away data outside the 95% interval
    GDP_Final = [x for x in GDP if (x > mean - 2 * sd and x < mean + 2 * sd)]
    print(GDP_Final[-1])

    #Create the bins for the histogram
    binJump = int((GDP_Final[-1]-GDP_Final[0])/amoundOfBins)
    bins = [GDP_Final[0]+bin*binJump for bin in range(1,amoundOfBins)]
    print(bins[-1])

    #plot hist with the values and bins.
    plt.hist(GDP_Final, bins, histtype='bar', rwidth=0.9)
    plt.ylabel('Lands')
    plt.xlabel('GDP ($ per capita) dollars')
    plt.title('Display of the amound of lands with GDP in dollars')
    plt.show()
    return

if __name__ == "__main__":

    # get data and visualize data with panda.
    data = getDataCSV()
    df = pd.DataFrame(data[0])

    makeHist(sorted(data[1]))

    # create boxplot with title
    ax = sns.boxplot(data[2]).set_title("Infant mortality (per 1000 births), around the world")
    plt.show()

    # write json
    with open('data.json', 'w') as outfile:
        json.dump(data[0], outfile)

    # df2 = pd.DataFrame(region)
    #
    # for item in df2:
    #     print(item[0])
    # yLabel = []
    #
    # print(np.mean(region['BALTICS']))

            # lands.append(str(item))
            # GDP.append(df.get(item)[3])

    # plt.bar(lands, GDP)
    # plt.ylabel('Usage')
    # plt.title('Programming language usage')
    # plt.show()

    # landGDP = np.array(df[['Country', 'GDP']]).tolist()
    #
    # for value in landGDP:
    #     if value[1] == 'N/A':
    #         landGDP.remove(value)
    #
    # print(landGDP[1][1])

    # print(np.mean(landGDP.transpose[2]))
    # print(landGDP)

    # for value in range(len(df['Country'])):
    #     if df['GDP'][value] == 'N/A':
    #         print('gotcha')
    #     else:


    # Values = df['GDP']
    # for value in range(Values):
    #     if Values[value] == 'N/A'
    #

    # print(statistics.stdev(int(df['GDP'])))
    # print(Values)
    # print(df)

    # # //////////////////////////////////////////////////////////////////////////
    # df = pd.DataFrame(getDataCSV())
    #
    # region = {}
    # xLabel = []
    #
    # for item in df:
    #     if df.get(item)[3] != 'N/A':
    #         if df.get(item)[0] in region:
    #             region[df.get(item)[0]].append(int(df.get(item)[3]))
    #         else:
    #             region[df.get(item)[0]] = [int(df.get(item)[3])]
    #             xLabel.append(df.get(item)[0])
    # # ///////////////////////////////////////////////////////////////////////
