
from unicodedata import name
from django.urls import path
from . import views


urlpatterns = [
    path('', views.sketchPage, name="sketch-page"),
    path('home/', views.home, name="home"),
    path('book/<str:pk>/', views.book, name="book"),
    path('generating/', views.generatingStroke, name="generating"),
    path('getStroke/', views.getStroke, name='get-stroke'),
    path('getText/', views.getText, name='get-text'),
    path('generatingText/', views.generatingText, name='generatingText'),
    path('story-save/', views.saveStory, name='saveStory')
]
