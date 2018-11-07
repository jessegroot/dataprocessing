#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt


# global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

def getGraph(ratings):
    plotValuesY = []
    plotValuesX = []
    # append the mean ratings to the plotValuesY en the years to the plotValuesX
    for rating in ratings:
        plotValuesY.append(rating[1]/rating[0])
    for years in range(START_YEAR,END_YEAR):
        plotValuesX.append(years)

    # plot the graph
    plt.plot(plotValuesX,plotValuesY)
    plt.ylabel('Rating Score')
    plt.xlabel('Year of Release')
    plt.show()
    return

if __name__ == "__main__":
    #open CSV file
    with open(INPUT_CSV) as csvfile:
        #make reader of the CSV file
        lineReader = csv.DictReader(csvfile)
        couples = []
        # loop over the lines in CSV file
        for row in lineReader:
            # make couples per film of rating and year
            couples.append([row['Rating'],row['Year']])

        meanYear = []
        # loop over the years
        for years in range(START_YEAR,END_YEAR):
            meanYear.append([0, 0])
            # sum the ratings from each year
            for couple in couples:
                if int(couple[1]) == years:
                    meanYear[years-START_YEAR][1] = meanYear[years-START_YEAR][1] + float(couple[0])
                    meanYear[years-START_YEAR][0] = meanYear[years-START_YEAR][0] + 1

        # give the summed ratings to the graph maker
        graph = getGraph(meanYear)
