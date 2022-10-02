from os import remove
import numpy as np
from rdp import rdp
import time


def splitOriginalData(strArr):
    """
        Pass an array of strings, e.g. ['1,2,0,2,2,0', '1,3,1,2,1,0,3,0,3,3,0']
        return an array of int arrays, e.g. [ [[1,2,0] [2,2,0]] [[1,3,1] [2,1,0] [0,3,0] [3,3,0]] ]
    """
    intArray = []
    for each in strArr:
        oneStrokeArr=[]
        strInnerArr = each.split(',')
        #print("strInnerArr = ", strInnerArr)
        for i in range(0,len(strInnerArr), 3):
            eachPoint = []
            eachPoint.append(int(strInnerArr[i]))
            eachPoint.append(int(strInnerArr[i+1]))
            eachPoint.append(int(strInnerArr[i+2]))
            #print("eachPoint = ", eachPoint)
            oneStrokeArr.append(eachPoint)
            #print("oneStrokeArr = ", oneStrokeArr)
        intArray.append(oneStrokeArr)
    return intArray


def rdpData(originalArr):
    """
        Pass an np-array with arrays of one stroke, e.g. the result of splitOriginalData 
    """
    rdpArray = []
    for each in originalArr:
        tempArr = each[:len(each)-1]
        tempArr = rdp(tempArr, epsilon=2)
        tempArr.append(each[len(each)-1])
        rdpArray += tempArr
        
    return(rdpArray)


def finalProcessData(afterRdpArray):
    finalArray = []
    for i in range(1,len(afterRdpArray)-1):
        if afterRdpArray[i][2] == 1:
            continue
        elif afterRdpArray[i-1][2] == 1:
            tempArr = [0,0,0]
            tempArr[0] = round(afterRdpArray[i][0] * 0.02, 5)
            tempArr[1] = round(afterRdpArray[i][1] * 0.02 ,5)
            finalArray.append(tempArr)
        else:
            tempArr = [0,0,0]
            tempArr[0] = round((afterRdpArray[i+1][0] - afterRdpArray[i][0]) * 0.02, 5)
            tempArr[1] = round((afterRdpArray[i+1][1] - afterRdpArray[i][1]) * 0.02 ,5)
            if afterRdpArray[i+1][2] == 1:
                tempArr[2] = 1
            finalArray.append(tempArr)
    return finalArray

def connectEachStrokeToOneArray(originalArr):
    withoutRdpArr = []
    for each in originalArr:
        withoutRdpArr += each
    return withoutRdpArr

def WithoutRdp(inputArr):
    resultArray = []
    resultArray = splitOriginalData(inputArr)
    #resultArray = rdpData(resultArray)
    resultArray = connectEachStrokeToOneArray(resultArray)
    resultArray = finalProcessData(resultArray)
    #print(resultArray)
    resultArray = np.array(resultArray)
    #print(resultArray)
    return(resultArray)
def SimplyArray(inputArr):
    '''
    Pass an array of strings, e.g. ['1,2,0', '2,2,0']
    And get the simplfied np-array with epsilon=2.0
    '''
    resultArray = []
    resultArray = splitOriginalData(inputArr)
    resultArray = rdpData(resultArray)
    resultArray = finalProcessData(resultArray)
    #print(resultArray)
    resultArray = np.array(resultArray)
    #print(resultArray)
    return(resultArray)


def SaveArrayLocal(inputNPArr, datasetName):
    '''
    Pass an np-array to save in local folder 'datasetName'
    as 'datasetName_timestamp.npy'
    '''
    stamp = time.time()
    stamp = int(stamp*100)
    strokeName = 'dataset/'+datasetName+'/'+datasetName+'_'+str(stamp)
    np.save(strokeName, inputNPArr)
    print('Save a new stroke file in', datasetName)
    return strokeName
