from google.appengine.ext import webapp
from google.appengine.ext import db
from datetime import datetime, timedelta
import hashlib
from google.appengine.api.datastore_errors import BadKeyError
from google.appengine.api.datastore_types import Key

class Authorisation:
    """This class chack user uthirisation"""
    obj = webapp.RequestHandler()
    cookieNameUserId = "GUserName"
    cookieNamePasswordHash = "GPassHash"
    cookieValueUserId = ""
    cookieValuePasswordHash = ""
    userName = ""

    def __init__(self, r_obj):
        """Constructor get RequestHandler() and set Cookie value if they exist"""
        self.obj = r_obj
        try:
            self.cookieValueUserId = str(self.obj.request.cookies[self.cookieNameUserId])
            self.cookieValuePasswordHash = str(self.obj.request.cookies[self.cookieNamePasswordHash])
        except KeyError:
            self.cookieValueUserId = ""
            self.cookieValuePasswordHash = ""

    def getCookieValue(self):
        """Method for testing return Cookies values"""
        return str(self.obj.request.cookies[self.cookieNameUserId])

    def setCookie(self,key,passwordHash):
        """This method set Coolie values(key,passwordHash).Cookie live time 30min,you can change in 'dalay' variable"""
        #Get now date and time
        cookieDate = datetime.today()
        #Delay COOKIE death time or add time to COOKIE life time.
        delay = timedelta(minutes = 120)
        # Add time to now date.
        cookieDate += delay
        # Set COOKIE.
        self.obj.response.headers.add_header('Set-Cookie', self.cookieNameUserId + '=' + key + ';' +
                                              cookieDate.strftime(" expires=%a, %d-%b-%Y %H:%M:%S GMT; ") + ' path=/;')
        self.obj.response.headers.add_header('Set-Cookie', self.cookieNamePasswordHash + '=' + passwordHash + ';' +
                                              cookieDate.strftime(" expires=%a, %d-%b-%Y %H:%M:%S GMT; ") + ' path=/;')

    def authoriseUser(self, userName, password):
        """Method check user name and password if user exist set cookie(userKey,passwordHash) and
        return true, else return false"""
        passwordHash = hashlib.md5(password).hexdigest()
        us = db.GqlQuery("SELECT * FROM Users WHERE name=:1 AND password=:2 limit 1",userName,passwordHash)

        if us.count(1) == 1:
            key = str(us[0].key())
            passHash = us[0].password
            self.setCookie(key,passHash)
            return True
        else:
            self.obj.redirect("/")
            return False

    def checkCookieUser(self):
        """Method check user data(userKey,passwordHash) from cookie if user exist return true,
        else false"""
        try:
            key = Key(self.cookieValueUserId)
        except BadKeyError:
            return False
        us = db.GqlQuery("SELECT * FROM Users WHERE __key__=:1 AND password=:2 limit 1",
                         key, self.cookieValuePasswordHash)
        if us.count(1) == 1:
            self.userName = us[0].name
            return True
        else:
            return False

    def deleteCookie (self):
        """Method delete cookie."""
        #Get now date and time
        cookieDate = datetime.today()
        self.obj.response.headers.add_header('Set-Cookie', self.cookieNameUserId + '=' + ' ' + ';' +
                                              cookieDate.strftime(" expires=%a, %d-%b-%Y %H:%M:%S GMT; ") + ' path=/;')
        self.obj.response.headers.add_header('Set-Cookie', self.cookieNamePasswordHash + '=' + ' '+ ';' +
                                              cookieDate.strftime(" expires=%a, %d-%b-%Y %H:%M:%S GMT; ") + ' path=/;')

    #############################
    def getUserKey(self):
        """Use this method after call checkCookieUser() or catch exception 'BadKeyError' in your code"""
        return Key(self.cookieValueUserId)

  