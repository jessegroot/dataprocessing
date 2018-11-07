#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import timeit
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from urllib.request import urlopen
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_dat\
e=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

def extract_movies(dom):

    #storage room for all data
    allData = []
    #For loop that goes through all the movies on site.
    for films in dom.find_all('div', class_='lister-item-content'):

        #Add title of movie
        allData.append(str(films.find('a').get_text()))


        #Add Ratings of movies
        allData.append(films.find('strong').get_text())

        #Add release_date of the movie minus other signs
        release = films.find('span', class_='lister-item-year text-muted unbold').get_text()
        release = int(''.join(filter(str.isdigit, release)))
        allData.append(release)

        #Select the p where the actors are in.
        # actors = films.find_all('p')[2].get_text()

        actors = films.select("a[href*='?ref_=adv_li_st']")
        allActors = []
        for actor in actors:
            if allActors == []:
                allActors.append(actor.get_text())
            else:
                allActors = ", ".join([allActors, actor.get_text()])
        # allActors = ", ".join(str(allActors) for x in allActors)

        allData.append(allActors)

        # print(actors.get_text())
        #
        # #Select strings as wholes.
        # actors = re.sub("[^\w]", " ", actors).split()
        # acces = 0
        # listActors = 0
        #
        # #Use forloop to go through all words and select only the titles\
        # #Who come after Stars.
        # for actor in actors:
        #     if acces == 1 or acces == 2:
        #         if acces == 1:
        #             firstname = actor
        #             acces = 2
        #         else:
        #             firstname = (''.join([firstname, " ", actor]))
        #             if listActors == 0:
        #                 listActors = firstname
        #             else:
        #                 listActors = (''.join([listActors, ", ", firstname]))
        #             acces = 1
        #     if actor == "Stars":
        #         acces = 1
        # allData.append(listActors)

        #Add Genre of the movie minus /n
        allData.append(films.find('span', class_='genre').get_text()[1:])

        #Add runtime of movie (minus the min ([:-4]))
        allData.append(films.find('span', class_='runtime').get_text()[:-4])

    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated  if more than one)
    - Runtime (only a number!)
    """
    print(allData)
    #Return the Movie data
    return [allData]


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile, delimiter=',')
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Genre', 'Runtime'])
    #loop over the movies and writhing their 6 atributes
    for row in range(0,50):
        writer.writerow([movies[0][0+(row*6)], movies[0][1+(row*6)], movies[0][2+(row*6)], movies[0][3+(row*6)], movies[0][4+(row*6)], movies[0][5+(row*6)]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
