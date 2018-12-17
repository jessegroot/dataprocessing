#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579

import json
import csv

INPUT_CSV_Perc = "Data_Import_that_is_export.csv"
IMPUT_CVS_Im_Ex = "Data_Import_Export_Goods.csv"

def getJSON():
    # make json object
    json = {}

    # open csv file
    with open(INPUT_CSV_Perc) as csvfile:
        lineReader = csv.DictReader(csvfile)
        print(lineReader)
        for line in lineReader:
            json[line['ï»¿"LOCATION"']] = {'Percentage': float(line["Value"])}

    with open(IMPUT_CVS_Im_Ex) as csvfile:
        lineReader = csv.DictReader(csvfile)
        valueAmound = 0
        for line in lineReader:
            if ((line['ï»¿"LOCATION"'] in json) and (line["SUBJECT"] == "EXP")):
                json[line['ï»¿"LOCATION"']]["EXP"] = float(line["Value"])
            elif ((line['ï»¿"LOCATION"'] in json) and (line["SUBJECT"] == "IMP")):
                json[line['ï»¿"LOCATION"']]["IMP"] = float(line["Value"])

    landDel = []
    for land in json:
        if len(json[land]) != 3:
            landDel.append(land)

    for land in landDel:
        del json[land]

    return json

def addCalculations(json):

    for item in json:
        json[item]["realEXP"] = (json[item]["EXP"]*((100-json[item]["Percentage"])/100))
        json[item]["realIMP"] = (json[item]["IMP"] - (json[item]["EXP"] - json[item]["realEXP"]))

    return json

if __name__ == "__main__":

    # get json
    jsonStruct = getJSON()

    completeJson = addCalculations(jsonStruct)

    # write json
    with open('data.json', 'w') as outfile:
        json.dump(completeJson, outfile)
