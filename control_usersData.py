import hashlib
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext import db
import os
from models import Users
from util_authorisation import Authorisation

class AddUserForm(webapp.RequestHandler):
    def post(self):
        if self.request.get('name') != ''\
           and self.request.get('email') != ''\
           and self.request.get('password1') != ''\
           and self.request.get('password2') != ''\
        and (self.request.get('password1') == self.request.get('password2')):
            user = Users()
            user.name = self.request.get('name')
            user.email = self.request.get('email')
            user.password = hashlib.md5(self.request.get('password1')).hexdigest()
            user.put()
            self.redirect('/adduser_form')
        else:
            template_values = {
                'error': 'error',
            }
            path = os.path.join(os.path.dirname(__file__), 'templates/add_user.html')
            self.response.out.write(template.render(path, template_values))

    def get(self):
        users = db.GqlQuery("SELECT * FROM Users")

        template_values = {
            'users':users,
        }

        path = os.path.join(os.path.dirname(__file__), 'templates/add_user.html')
        self.response.out.write(template.render(path, template_values))
        
class CheckUser(webapp.RequestHandler):
    def get(self):
        if self.request.get('error') == '1':
            value = {'error': True}
        else:
            value = {'error': False}
        aut = Authorisation(self)
        aut.deleteCookie()
        path = os.path.join(os.path.dirname(__file__), 'templates/loginPassCheck.html')
        self.response.out.write(template.render(path, value))
    def post(self):
        login = self.request.get('name')
        password = self.request.get('password')
        aut = Authorisation(self)
        if aut.authoriseUser(login,password):
            self.redirect("/mapgoogle")
        else:
            self.redirect("/?error=1")

class RegisterUser(webapp.RequestHandler):
        def get(self):
            if self.request.get('error') == '1':
                value = {'error': True}
            else:
                value = {'error': False}
            path = os.path.join(os.path.dirname(__file__), 'templates/register.html')
            self.response.out.write(template.render(path, value))
        def post(self):
            if self.request.get('name') != ''\
                and self.request.get('password1') != ''\
                and self.request.get('password2') != ''\
                and (self.request.get('password1') == self.request.get('password2')):
                    user = Users()
                    user.name = self.request.get('name')
#                    user.email = self.request.get('email')
                    user.password = hashlib.md5(self.request.get('password1')).hexdigest()
                    user.put()
                    self.redirect('/')
            else:
                self.redirect("/register?error=1")