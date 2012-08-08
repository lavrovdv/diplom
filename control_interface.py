from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
import os
from util_authorisation import Authorisation

class MapTest(webapp.RequestHandler):
    def get(self):

        aut = Authorisation(self)
        if aut.checkCookieUser():
            values = {'userNmae':aut.userName}
            path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
            self.response.out.write(template.render(path, values))
        else:
            self.redirect("/")