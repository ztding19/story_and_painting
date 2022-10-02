from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    author = models.CharField(max_length=20, null=True)
    sketch_strokes = models.CharField(max_length=9999999)
    sketch_colors = models.CharField(max_length=1000)
    story = models.CharField(max_length=5000)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title