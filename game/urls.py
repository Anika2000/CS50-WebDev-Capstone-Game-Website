from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"), 
    path("register", views.register, name="register"), 
    path("login", views.login_view, name="login"), 
    path("logout", views.logout_view, name="logout"), 
    path("hangman/<str:name>", views.user, name="user"), 
    path("follow/<str:name>", views.follow, name="follow"), 
    path("unfollow/<str:name>", views.unfollow, name="unfollow"),
    
    #API
    #start a new game
    path("game-start", views.gameStart, name="game-start"), 
    #info about a certain game, given the id 
    path("game/<int:id>", views.gameProfile, name="game-profile"), 
    #info about profile
    path("game/<str:name>", views.userProfile, name="user-profile"), 
    #send message
    path("sendMessage", views.chatSend , name="send-message"), 
    #messages of a user
    path("messages", views.allMessages, name="all-messages"), 
    #all won games
    path("wongames/<str:name>", views.wonGames, name="wongames"), 
    #all lost games
    path("lostgames/<str:name>", views.lostGames, name="lostgames")
]
