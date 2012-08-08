from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from control_gpsData import JsonData, GPSDataByDate, GPSDataLast
from control_insertData import  InsertData
from control_interface import MapTest
import control_devicesData
from control_polygon import SaveArea, LoadAreas, DeleteArea
from control_tests import  JsonTest, Test, DeleteGPSData, DeleteDeviceData, DeleteUserData
from control_usersData import  AddUserForm, CheckUser, RegisterUser


def main():
    application = webapp.WSGIApplication(
            [('/json_data', JsonData),
             ('/device', control_devicesData.DeviceData),
             ('/adddevice_form', control_devicesData.AddDeviceForm),
             ('/adduser_form', AddUserForm),
             ('/track', JsonTest),
             ('/save_area', SaveArea),
             ('/load_areas', LoadAreas),
             ('/delete_area', DeleteArea),
             ('/mapgoogle', MapTest),
             ('/gps_data_by_date', GPSDataByDate),
             ('/gps_data_last', GPSDataLast),
             ('/', CheckUser),
             ('/register', RegisterUser),
             ('/test', Test),
             ('/delete_gps', DeleteGPSData),
             ('/delete_devise', DeleteDeviceData),
             ('/delete_User', DeleteUserData),
             ('/insert', InsertData)],
            debug=False)

    run_wsgi_app(application)

if __name__ == '__main__':
    main()
