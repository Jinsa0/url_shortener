from django.db import models
from django.contrib.auth.models import AbstractUser

from autoslug import AutoSlugField

from main.models import BaseModel
from main.utils import custom_slugify

class Account(AbstractUser, BaseModel):
    username = models.CharField(max_length=128, unique=True)
    slug = AutoSlugField(populate_from="username", slugify=custom_slugify, unique=True, editable=False, auto_created=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.username} ({self.slug})"
    
    class Meta:
        verbose_name = "Account"
        verbose_name_plural = "Accounts"