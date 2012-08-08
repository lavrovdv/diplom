from google.appengine.ext import webapp
from util_GPRMCparse import GPRMCparse
from models import GpsData

class InsertData(webapp.RequestHandler):
    def get(self):
        gpsData = GpsData()
        #str = self.request.get()
        gps = GPRMCparse(self.request.get("data"))
        if gps:
            gpsData.date = gps.datetime
            gpsData.latitude = gps.latitude
            gpsData.longitude = gps.longitude
            #gpsData.geoPoint = (gps.latitude + "," + gps.longitude)
            gpsData.speed = gps.speed
            gpsData.imei = gps.imei
            gpsData.put()
            self.response.out.write("add")
        #self.redirect('/')
  