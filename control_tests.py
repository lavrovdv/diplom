from datetime import datetime
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext import db
import os
from control_gpsData import GpsDataJsonSerialiser
from util_authorisation import Authorisation


class JsonTest(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            values = {'1':1}
            path = os.path.join(os.path.dirname(__file__), 'templates/2.html')
            self.response.out.write(template.render(path, values))

    #url - /test

class Test(webapp.RequestHandler):
    def get(self):
        global data
        aut = Authorisation(self)
        if aut.checkCookieUser():
            imei = int(self.request.get('imei'))   #test on error
            data = 0
            data = db.GqlQuery("SELECT * FROM GpsData WHERE imei = 24031989 ORDER BY date DESC LIMIT 2")
            data1 = db.GqlQuery("SELECT * FROM GpsData WHERE imei = :1 ORDER BY date DESC LIMIT 2", imei)
            jsonSerializer = GpsDataJsonSerialiser()
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write('static\n count - ' + str(jsonSerializer.get_count(data)) + '\n' + jsonSerializer.getSomeElementsString(data, 50) + '\n from parameter\n count - ' + str(jsonSerializer.get_count(data1)) + '\n' + jsonSerializer.getSomeElementsString(data1, 50))
        else:
            requestString = '{"ServerData":[{"GPS":{"date": "error"}}]'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(requestString)

class DeleteGPSData(webapp.RequestHandler):
    def get(self):
        gpsData = db.GqlQuery("SELECT * FROM GpsData")
        db.delete(gpsData)

class DeleteDeviceData(webapp.RequestHandler):
    def get(self):
        deviceData = db.GqlQuery("SELECT * FROM Device")
        db.delete(deviceData)

class DeleteUserData(webapp.RequestHandler):
    def get(self):
        userData = db.GqlQuery("SELECT * FROM Users")
        db.delete(userData)






