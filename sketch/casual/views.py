from email import contentmanager
from .sketchGenerate import drawbyStroke, drawbyWord
from urllib.parse import SplitResult
from .strokeSave import SaveArrayLocal, SimplyArray, WithoutRdp, finalProcessData, splitOriginalData, rdpData
import django
from django.http import HttpResponse, JsonResponse, request
from django.shortcuts import redirect, render
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
import numpy as np
from .generate_function import main
from .models import Book

# Create your views here.


generatingStroke = []
inputText = ""
generatingText = ""


def home(request):
    books = Book.objects.all()
    context = {'books' : books}
    return render(request, 'casual/home_page.html', context)

def book(request, pk):
    book = Book.objects.get(id=pk)
    context = {'book' : book}
    return render(request, 'casual/book.html', context)

@csrf_exempt
def sketchPage(request):
    data = request.POST.getlist('stroke_arr[]')
    datasetName = request.POST.get('dataset_name')
    if len(data) != 0 and datasetName != "none":

        
        SaveArrayLocal(SimplyArray(data),datasetName=datasetName)
        
        # drawbyStroke(SaveArrayLocal(SimplyArray(data),
        #              datasetName)+'.npy', datasetName)
    # elif datasetName != "none":
    #     drawbyWord(datasetName)
        
    return render(request, 'casual/sketch_page.html')

@csrf_exempt
def getStroke(request):
    global generatingStroke
    generatingStroke = []
    #global datasetName
    #array = np.load('output/cat.npy')
    #array = array.tolist()
    datasetName = request.POST.get('dataset_name')
    print(datasetName)
    generatingStroke = drawbyWord(datasetName)
    return render(request, 'casual/sketch_page.html')

def generatingStroke(request):
    global generatingStroke
    try:
        generatingStroke = generatingStroke.tolist()
    except:
        pass
    return JsonResponse({'test':generatingStroke})

@csrf_exempt
def getText(request):
    global inputText
    inputText = request.POST.get('input_content')
    # text = main(50, 0.7, inputText)
    return render(request, 'casual/sketch_page.html')
    # return JsonResponse({'generatingText': text})


def generatingText(request):
    print("Input content :", inputText)
    text = main(50, 0.7, inputText)
    print("Result", text)
    return JsonResponse({'generatingText': text})

@csrf_exempt
def saveStory(request):
    title = request.POST.get('title')
    description = request.POST.get('description')
    author = request.POST.get('author')
    story = request.POST.get('story')
    sketch_strokes = request.POST.get('sketch_strokes')
    sketch_colors = request.POST.get('sketch_colors')
    if(title!=''):
        print(title)
        print(author)
        book = Book(title=title, description=description, author=author, story=story, sketch_strokes=sketch_strokes, sketch_colors=sketch_colors)
        book.save()
        return redirect('http://127.0.0.1:8000/home/')
    return render(request, 'casual/sketch_page.html')
