#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579

import json

INPUT_TXT = "KNMI_20180101.txt"

def getJSON():
    json = {}
    with open(INPUT_TXT) as txtfile:
        for line in txtfile:
            if not line.startswith('#') and not line.startswith('<') :
                line = line.split(',')
                print(line)
                json[line[1]] = {'temp': line [2].strip(), 'neerslag': line[3].strip()}
                print(json[line[1]])

    return json


if __name__ == "__main__":

    jsonStruct = getJSON()

    with open('data.json', 'w') as outfile:
        json.dump(jsonStruct, outfile)
