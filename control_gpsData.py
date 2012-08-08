# -*- coding: utf-8 -*-

from datetime import datetime, datetime, timedelta
from google.appengine.ext import webapp
from google.appengine.ext import db
from util_authorisation import Authorisation


class JsonData(webapp.RequestHandler):
    def get(self):
        global data
        aut = Authorisation(self)
        if aut.checkCookieUser():
            imei = int(self.request.get('imei'))   #test on error
#            limit = int(self.request.get('limit')) #test on error
            data = 0
            data = db.GqlQuery("SELECT * FROM GpsData WHERE imei = :1 ORDER BY date DESC LIMIT 2", imei)
            jsonSerializer = GpsDataJsonSerialiser()
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(jsonSerializer.getSomeElementsString(data, 50))
        #            self.response.out.write(jsonSerializer.getString(data))
        else:
            requestString = '{"ServerData":[{"GPS":{"date": "error"}}]'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(requestString)

class GPSDataLast(webapp.RequestHandler):
    def get(self):
            global data
            aut = Authorisation(self)
            if aut.checkCookieUser():
                imei = int(self.request.get('imei'))   #test on error
                data = db.GqlQuery("SELECT * FROM GpsData WHERE imei = :1 ORDER BY date DESC LIMIT 1", imei)
                jsonSerializer = GpsDataJsonSerialiser()
                self.response.headers['Content-Type'] = 'text/plain'
                self.response.out.write(jsonSerializer.getSomeElementsString(data, 50))
            else:
                requestString = '{"ServerData":[{"GPS":{"date": "error"}}]'
                self.response.headers['Content-Type'] = 'text/plain'
                self.response.out.write(requestString)

class GPSDataByDate(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            separator = "."
            #        try:
            imei = int(self.request.get('imei'))
            startDate = self.request.get('startDate') #+ separator + self.request.get('startTime')
            endDate = self.request.get('endDate') #+ separator + self.request.get('endTime')
            sD = startDate.split(separator)
            eD = endDate.split(separator)
            startDate = datetime(int(sD[2]), int(sD[1]), int(sD[0]))
            endDate = datetime(int(eD[2]), int(eD[1]), int(eD[0]))
            delay = timedelta(hours=23, minutes=59, seconds=59)
            endDate += delay

#            requestString = 'startdate- ' + str(startDate) + ' end date-' + str(endDate)
#            self.response.headers['Content-Type'] = 'text/plain'
#            self.response.out.write(requestString)
        #        self.sendErrorMsg(self)
            jsonSerializer = GpsDataJsonSerialiser()

            data = db.GqlQuery( "SELECT * FROM GpsData WHERE date >= :1 AND date <= :2 AND imei = :3 ORDER BY date ASC", startDate, endDate, imei)
#TODO: посмотреть метод jsonSerializer.getSomeElementsString проверить возможность работы с превышением лимита(1000)
            if jsonSerializer.get_count(data) > 0:
                self.response.headers['Content-Type'] = 'text/plain'
                self.response.out.write(jsonSerializer.getSomeElementsString(data, 50))
            else:
                self.sendErrorMsg(self)
        else:
            self.sendErrorMsg(self)

    def sendErrorMsg(self, requestHandler):
        requestString = '{"ServerData":[{"GPS":{"date": "error"}}]'
        requestHandler.response.headers['Content-Type'] = 'text/plain'
        requestHandler.response.out.write(requestString)

class GpsDataJsonSerialiser:
#    Query = 0
#    def __init__(self, GPSDataQueryObject):
#        self.query = GPSDataQueryObject

    def getString(self, GPSDataQueryObject):
    #        self.Query = GPSDataQueryObject
        dataString = ""
        for element in GPSDataQueryObject:
        #            key = str(element.key)
            date = str(element.date)
            latitude = str(element.latitude)
            longitude = str(element.longitude)
            speed = str(element.speed)
            imei = str(element.imei)
            dataString += '{"GPS":{"date":"' + date +\
                          '","latitude":"' + latitude +\
                          '","longitude":"' + longitude +\
                          '","speed":"' + speed +\
                          '","imei":"' + imei + '"}},'
        result = '{"ServerData":[' + dataString[:-1] + ']}'
        return result

    def getSomeElementsString(self, GPSDataQueryObject, maxResultCount):
        dataString = ""
        objectCount = self.get_count(GPSDataQueryObject)
        index = objectCount / maxResultCount
        index = int(index)

        iteration = 0
        if objectCount > maxResultCount:
            for element in GPSDataQueryObject:
                iteration = iteration + 1
                if iteration != index: continue
                iteration = 0
                date = str(element.date)
                latitude = str(element.latitude)
                longitude = str(element.longitude)
                speed = str(element.speed)
                imei = str(element.imei)
                dataString += '{"GPS":{"date":"' + date +\
                              '","latitude":"' + latitude +\
                              '","longitude":"' + longitude +\
                              '","speed":"' + speed +\
                              '","imei":"' + imei + '"}},'

            result = '{"ServerData":[' + dataString[:-1] + ']}'
            return result
        else:
            someString = self.getString(GPSDataQueryObject)
            return someString

    def getStringFromArray(self, ArrayGPSDataQueryObject):
    #        self.Query = GPSDataQueryObject
        dataString = ""
        for GPSDataQueryObject in ArrayGPSDataQueryObject:
            for element in GPSDataQueryObject:
                date = str(element.date)
                latitude = str(element.latitude)
                longitude = str(element.longitude)
                speed = str(element.speed)
                imei = str(element.imei)
                dataString += '{"GPS":{"date":"' + date +\
                              '","latitude":"' + latitude +\
                              '","longitude":"' + longitude +\
                              '","speed":"' + speed +\
                              '","imei":"' + imei + '"}},'
        result = '{"ServerData":[' + dataString[:-1] + ']}'
        return result

    def get_count(self, GqlQueryObject):
        count = 0
        for item in GqlQueryObject:
            count += 1
        return count
