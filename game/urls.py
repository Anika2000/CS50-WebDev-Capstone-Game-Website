from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"), 
    path("register", views.register, name="register"), 
    path("login", views.login_view, name="login"), 
    path("logout", views.logout_view, name="logout"), 
    
    path("game-start", views.gameStart, name="game-start"), 
    path("game/<int:id>", views.gameProfile, name="game-profile")
]
