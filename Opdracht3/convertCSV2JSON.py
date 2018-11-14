# import csv
# import json
#
# csvfile = open('file.csv', 'r')
# jsonfile = open('file.json', 'w')
#
# fieldnames = ("FirstName","LastName","IDNumber","Message")
# reader = csv.DictReader( csvfile, fieldnames)
# for row in reader:
#     json.dump(row, jsonfile)
#     jsonfile.write('\n')
import json

with open("string.txt", "rb") as fin:
    content = json.load(fin)
with open("stringJson.txt", "wb") as fout:
    json.dump(content, fout, indent=1)
