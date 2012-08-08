# -*- coding: utf-8 -*-
from google.appengine.api.datastore_errors import BadKeyError, BadKeyError
from google.appengine.api.datastore_types import Key, Key
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext import db
from models import Area

# добавить в запросы выбор данных для пользователя и авторизацию
from util_authorisation import Authorisation

class SaveArea(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            name = self.request.get('name')
            description = self.request.get('description')
            polygon = self.request.get('polygon')
            list = polygon.split('|')
            list = list[:-1]
            latList = []
            lngList = []

            for i in range(len(list)):
                if  i % 2:
                    lngList.append(float(list[i]))
                else:
                    latList.append(float(list[i]))
    #
            area = Area()
            area.name = name
            area.description = description
            area.latList = latList
            area.lngList = lngList
            area.user = aut.getUserKey()
#            area.name = "name12"
#            area.description = "desc12"
#            area.latList = [29.8025179058,-70.1806640625,29.8025179058,-70.1806640625]
#            area.lngList = [27.1764691319,-104.282226563,27.1764691319,-104.282226563]
#            area.user = aut.getUserKey()
            area.put()
        else:
            requestString = '{"Error":"error"}'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(requestString)

#            self.response.out.write('name - ' + name + '<br>' +
#                                    'description - ' + description + '<br>' +
#                                    'polygon - ' + polygon + '<br>' +
#                                    'latList - ' + str(latList) + '<br>' +
#                                    'lngList - ' + str(lngList) + '<br>')

class LoadAreas(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            user = aut.getUserKey()
            areas = db.GqlQuery("SELECT * FROM Area WHERE user=:1",user)
            dataString = ""
            for element in areas:
                id = str(element.key())
                name = element.name
                description = element.description
                dataString += '{"id":"'+ id +\
                               '","name":"' + name + \
                               '","description":"'+ description +\
                               '","polygon":['
                polygonString = ""
                for i in range(len(element.latList)):
                    lat = str(element.latList[i])
                    lng = str(element.lngList[i])
                    polygonString += '{"lat":"' + lat + '","lng":"' + lng + '"},'

                dataString = dataString + polygonString[:-1] + ']},'

            result = '{"Areas":[' + dataString[:-1] + ']}'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(result)

        else:
            requestString = '{"Error":"error"}'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(requestString)

class DeleteArea(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            try:
                key = Key(self.request.get('id'))
            except BadKeyError:
                return False
            area = db.GqlQuery("SELECT * FROM Area WHERE __key__=:1 limit 1",key)
            db.delete(area)


