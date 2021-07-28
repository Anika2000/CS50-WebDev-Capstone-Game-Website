from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from .models import User, GameInfo, Follower, ProfileInfo, Message
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
import json
import random

# Create your views here.
words = ["adore", "lover", "abuse", "adult", "agent", "anger", "amuse", "artsy", "beach", "birth", "mango", "straw", "sandy"]


def index(request): 
    return render(request, "game/index.html")


def register(request): 
    if request.method == "POST": 
        username = request.POST["username"]
        new_password = request.POST["password"]
        confirm_password = request.POST["confirm-password"]
        if new_password != confirm_password: 
            return render(request, "game/register.html", {
                 "message": "Confirm Password does not match Password. Please go back to register to fix it."
            })
        #create a user and then save it
        try:
            new_user = User.objects.create_user(username,None,new_password)
            new_user.save()
        except IntegrityError:
            return render(request, "game/register.html", {
                 "message": "Username already exists. Please go back to register to fix it."
            })
        login(request, new_user)
        return HttpResponseRedirect(reverse("index"))
    else: 
        return render(request, "game/register.html")


def login_view(request):
    if request.method == "POST":  
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "game/inherit.html", {
                "message": "Incorrect Login. Try Again"
            })
    return render(request, "game/login.html")


def logout_view(request): 
    logout(request)
    return HttpResponseRedirect(reverse("index"))


@csrf_exempt
def gameStart(request): 
    if request.method == "POST": 
        count = GameInfo.objects.all().count() + 1
        player = request.user 
        word = random.choice(words)
        win = False 
        new_game = GameInfo(self_num=count, player=player, word=word, win=win, word_state=11111, wrong_guesses=0)
        new_game.save()
        return_game = new_game.id
        return JsonResponse({"success" : return_game}, safe=False)
    return JsonResponse({"error" : "Need a POST request."}, status=400)


@csrf_exempt
def gameProfile(request, id): 
    try: 
        search_game = GameInfo.objects.get(id=id)
    except: 
        return JsonResponse({"error" : "Game doesn't exist"}, status=400)
    if request.method == 'GET': 
        return JsonResponse(search_game.serialize())
    elif request.method == 'PUT': 
        data = json.loads(request.body)
        if data.get("word_state") is not None: 
            search_game.word_state = data["word_state"]
        if data.get("wrong_guesses") is not None: 
            search_game.wrong_guesses = data["wrong_guesses"]
        if data.get("win") is not None: 
            search_game.win = data["win"]
        search_game.save()
        return HttpResponse(status=204)
    return JsonResponse({"error" : "Must be a GET request"}, status=400)


def convertToString(string_list): 
    str_list = " "
    return (str_list.join(string_list))

@csrf_exempt
@login_required
def userProfile(request, name): 
    try: 
        search_user = User.objects.get(username=name)
    except: 
        return JsonResponse({"error" : "Sorry User does not exist"}, status=400)
    player_name = search_user.username
    gamesPlayed = GameInfo.objects.filter(player=search_user).count()
    followers = search_user.users_followers.all().count()
    try: 
        followings = Follower.objects.get(follower=search_user)
        followings_count = followings.following.all().count()
    except: 
        followings_count = 0
    won_games = GameInfo.objects.filter(player=search_user, win=True)
    won_games_count = won_games.count()
    highlight_games_counter = []
    for game in won_games: 
        highlight_games_counter.append(1)
    highlight_games_counter_string = "ERROR"
    profile = ProfileInfo(player_name=player_name, followers=followers, followings=followings_count, played_games=gamesPlayed, 
    won_games=won_games_count, highlight_games_counter=highlight_games_counter_string)
    return JsonResponse(profile.serialize())

@csrf_exempt
@login_required
def user(request, name): 
    try: 
        search_user = User.objects.get(username=name)
    except: 
       return render(request, "game/false.html", {
           "name" : name
       })
    if Follower.objects.filter(follower=request.user, following=search_user).exists(): 
        follower = True
    else: 
        follower = False
    return render(request, "game/profile.html", {
        "name" : search_user.username, 
        "follower" : follower
    })


def follow(request, name): 
    if request.method == "POST":
        try: 
            follower = Follower.objects.get(follower=request.user, follower_name=request.user.username) 
        except: 
            follower = Follower.objects.create(follower=request.user, follower_name=request.user.username)
        wanting_to_follow = User.objects.get(username=name)
        follower.following.add(wanting_to_follow)
        return HttpResponseRedirect(reverse("index"))

def unfollow(request, name): 
    if request.method == "POST": 
        follower_user = Follower.objects.get(follower=request.user, follower_name=request.user.username)
        wanting_to_unfollow = User.objects.get(username=name)
        follower_user.following.remove(wanting_to_unfollow)
        return HttpResponseRedirect(reverse("index"))

@csrf_exempt
def chatSend(request): 
    if request.method == 'POST': 
        data = json.loads(request.body)
        sender = request.user
        sender_name = request.user.username
        receiver_name = data.get("receiver_name" ,"")
        chat_message = data.get("message_text", "")
        try: 
            receiver = User.objects.get(username=receiver_name)
        except: 
            return JsonResponse({"error": "No Username of such found. Try Again"}, status=400)
        new_message = Message(sender=sender, receiver=receiver, sender_name=sender_name, receiver_name=receiver_name, message_text=chat_message)
        new_message.save()
        return JsonResponse({"success": "Message was sent successfully"}, status=201)
    return JsonResponse({"error": "POST request required."}, status=400)


def allMessages(request): 
    receiver = request.user
    receiver_name = request.user.username 
    messages = Message.objects.filter(receiver=receiver, receiver_name=receiver_name)
    messages = messages.order_by("-timestamp").all()
    return JsonResponse([message.serialize() for message in messages], safe=False)


def wonGames(request, name): 
    try: 
        player = User.objects.get(username=name)
    except: 
        return JsonResponse({"error": "Incorrect User."}, status=400)
    games = GameInfo.objects.filter(player=player, win=True)
    return JsonResponse([game.serialize() for game in games], safe=False)


def lostGames(request, name): 
    try: 
        player = User.objects.get(username=name)
    except: 
        return JsonResponse({"error": "Incorrect User."}, status=400)
    games = GameInfo.objects.filter(player=player, win=False)
    return JsonResponse([game.serialize() for game in games], safe=False)

