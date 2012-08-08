from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext import db
import os
from util_authorisation import Authorisation
from models import Device

class DeviceData(webapp.RequestHandler):
    def get(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            key = aut.getUserKey()
            devices = db.GqlQuery("SELECT * FROM Device WHERE user=:1", key)
            dataString = ""
            for element in devices:
                name1 = element.name
                imei = str(element.imei)
                dataString += '{"name":"' + name1 + '","imei":"' + imei + '"},'

            requestString = '{"Device":[' + dataString[:-1] + ']}'
            self.response.headers['Content-Type'] = 'text/plain'
            self.response.out.write(requestString)
        else:
            self.response.out.write("error")


class AddDeviceForm(webapp.RequestHandler):
    def post(self):
        aut = Authorisation(self)
        if aut.checkCookieUser():
            key = aut.getUserKey()
            if self.request.get('name') != '' and self.request.get('imei') != '':
                device = Device()
                device.name = self.request.get('name')
                device.imei = int(self.request.get('imei'))
                device.user = key
                device.put()

            self.redirect('/adddevice_form')
        else:
            self.redirect("/")

    def get(self):
        devices = db.GqlQuery("SELECT * FROM Device")

        template_values = {
            'devices':devices,
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/add_device.html')
        self.response.out.write(template.render(path, template_values))