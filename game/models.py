from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser): 
    pass


class GameInfo(models.Model): 
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player")
    word = models.CharField(max_length=5)
    win = models.BooleanField(default=False)
    self_num = models.IntegerField(unique=True)
    def serialize(self): 
        return {
            "self_num" : self.self_num, 
            "word" : self.word, 
            "win" : self.win
        }
    def __str__(self): 
        return f" {self.self_num} Player: {self.player.username} Word: {self.word}"



