#!/usr/bin/env python
# Name: Jesse Groot
# Student number: 11012579

import json

INPUT_TXT = "KNMI_20180101.txt"

def getJSON():
    # make json object
    json = {}
    # open text file
    with open(INPUT_TXT) as txtfile:
        # read every line not starting with # or < and make json
        for line in txtfile:
            if not line.startswith('#') and not line.startswith('<') :
                line = line.split(',')
                json[line[1]] = {'temp': line [2].strip(), 'neerslag': line[3].strip()}
    return json

if __name__ == "__main__":

    # get json
    jsonStruct = getJSON()
    # write json
    with open('data.json', 'w') as outfile:
        json.dump(jsonStruct, outfile)
