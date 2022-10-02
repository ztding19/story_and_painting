from importlib.resources import path
import os


def getFolder():
    dirpath = "model/"
    list = os.listdir(dirpath)
    return list
