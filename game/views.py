from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, GameInfo
from django.contrib.auth import authenticate, login, logout
from django.http.response import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
import random

# Create your views here.
words = ["adore", "lover", "abuse", "adult", "agent", "anger", "apple", "award", "amuse", "beach"]


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
                "message": "Incorrect Login"
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
        new_game = GameInfo(self_num=count, player=player, word=word, win=win)
        new_game.save()
        return_game = new_game.id
        return JsonResponse({"success" : return_game}, safe=False)
    return JsonResponse({"error" : "Need a POST request."}, status = 400)


def gameProfile(request, id): 
    try: 
        search_game = GameInfo.objects.get(id=id)
    except: 
        return JsonResponse({"error" : "Game doesn't exist"}, status=400)
    if request.method == 'GET': 
        return JsonResponse(search_game.serialize())
    return JsonResponse({"error" : "Must be a GET request"}, status=400)
    

    
