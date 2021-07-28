from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser): 
    pass


class GameInfo(models.Model): 
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player")
    word = models.CharField(max_length=5)
    word_state = models.IntegerField()
    win = models.BooleanField(default=False)
    self_num = models.IntegerField(unique=True)
    wrong_guesses = models.IntegerField()
    def serialize(self): 
        return {
            "self_num" : self.self_num, 
            "word" : self.word, 
            "win" : self.win,
            "word_state" : self.word_state, 
            "wrong_guesses" : self.wrong_guesses
        }
    def __str__(self): 
        return f" {self.self_num} Player: {self.player.username} Word: {self.word} State: {self.word_state}"


class ProfileInfo(models.Model): 
    player_name = models.CharField(max_length = 500)
    followers = models.IntegerField()
    followings = models.IntegerField()
    played_games = models.IntegerField()
    won_games = models.IntegerField()
    # a string represnting a list of games won by this user
    highlight_games_counter = models.CharField(max_length=10)
    def serialize(self): 
        return {
            "player_name" : self.player_name, 
            "followers" : self.followers, 
            "followings" : self.followings, 
            "played_games" : self.played_games, 
            "won_games" : self.won_games, 
            "highlight_games_counter" : self.highlight_games_counter
        }
    def __str__(self): 
        return f"User: {self.player_name} follower: {self.followers} followings: {self.followings}"
        + "Games: {self.played_games} Won: {self.won_games}"


class Follower(models.Model): 
    following = models.ManyToManyField(User, blank=True, related_name="users_followers")
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    follower_name = models.CharField(max_length = 160)
    def serialize(self): 
        return {
            "follower" : self.follower_name
        }
    def __str__(self):
        return f"{self.follower_name}"


class Message(models.Model): 
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    sender_name = models.CharField(max_length=160)
    receiver_name = models.CharField(max_length=160)
    message_text = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "id": self.id,
            "sender_name": self.sender_name, 
            "receiver_name" : self.receiver_name, 
            "message_text" : self.message_text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
        }
    def __str__(self): 
        return f"Sender:{self.sender_name}  Receiver:{self.receiver_name}  Message:{self.message_text}"

    
