from google.appengine.ext import db

class GpsData(db.Model):
    date = db.DateTimeProperty()
    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    speed = db.FloatProperty()
    imei = db.IntegerProperty()

class Users (db.Model):
    name = db.StringProperty(multiline=False)
    email = db.EmailProperty()
    password = db.StringProperty(multiline=False)

class Device (db.Model):
    name = db.StringProperty(multiline=False)
    imei = db.IntegerProperty()
    user = db.ReferenceProperty(Users)

class Area (db.Model):
    name = db.StringProperty(multiline=False)
    description = db.StringProperty()
    latList = db.ListProperty(float)
    lngList = db.ListProperty(float)
    user = db.ReferenceProperty(Users)
