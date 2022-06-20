
# -*- coding: UTF-8 -*-
from ast import And
import sys
import os
import json
import io
import argparse
from time import time
import urllib
import csv
import re
import tubeId
current_path = os.path.abspath(__file__)
parent_path = os.path.join(os.path.dirname(__file__), '..')
destPath = os.path.join(parent_path, 'python', 'logjson')
fileName = os.path.join(parent_path, 'trans.csv')
dicArr = []
dicBox = {}
dicBoxSimple = {}


def addSampleNo(sampleList, entity):
    hasNode = False
    for sample in sampleList:
        print(sample)
        if 'participantId' in sample.keys() and 'participantId' in entity.keys() and str(sample['participantId']) == str(entity['participantId']):
            hasNode = True
            return
    sampleList.append(entity)


def generateBoxInfo(entityString, timeString):
    entity = json.loads(entityString)
    # 获取盒子编号
    print(entity)
    entity = entity['entity'][0]
    boxNo = entity['boxNo']
    sampleNo = entity['sampleNo']
    if boxNo not in dicBox.keys():
        dicBox[boxNo] = {sampleNo: [entity]}
        dicBoxSimple[boxNo] = {sampleNo: [entity]}
    else:
        boxInfo = dicBox[boxNo]
        if sampleNo not in boxInfo.keys():
            dicBox[boxNo][sampleNo] = [entity]
            dicBoxSimple[boxNo][sampleNo] = [entity]
        else:
            # dicBox[boxNo][sampleNo].append(entity)
            addSampleNo(dicBox[boxNo][sampleNo], entity)
            addSampleNo(dicBoxSimple[boxNo][sampleNo], entity)


def generateBoxDetailFile(boxName):
    fileGenerate = os.path.join(destPath, boxName+"Detail")+'.json'
    if os.path.exists(fileGenerate):
        os.remove(fileGenerate)
    with open(fileGenerate, 'w', encoding="utf-8") as f:
        #  f.write(json.dumps(entityString, indent=4, ensure_ascii=False))
        f.write(json.dumps(dicBox[boxName], indent=4, ensure_ascii=False))


def parse_service_config(file_name):
    file = os.path.join(parent_path, 'python', 'log', file_name)
    reader = iter(open(file))
    for line in reader:
      # or line.find("/ncov/lab/ncv-rcv-sample-info-t/update] {") > -1
        if line.find("/ncov/lab/ncv-participant-report-t/save] {") > -1:
            result = re.findall(
                r"{\"entity\":[{\"participantId\"[\s\S]*}]}", line)
            times_result = re.findall(
                r"(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2})", line)
            if(len(result) > 0):
                generateBoxInfo(result[0], times_result[0].replace(' ', '-'))

    # 生成indx集成文件
if __name__ == "__main__":
    file_name = sys.argv[1]
    print(file_name)
    # 'difei_helper-web.log.DF0000076172'
    parse_service_config(file_name)
    fileName = file_name+'result'
    fileGenerate = os.path.join(destPath, fileName)+'.json'
    if os.path.exists(fileGenerate):
        os.remove(fileGenerate)
    with open(fileGenerate, 'w', encoding="utf-8") as f:
        #  f.write(json.dumps(entityString, indent=4, ensure_ascii=False))
        f.write(json.dumps(dicBox, ensure_ascii=False))
        f.write('管码并集(用于管码丢失情况):')
        f.write('\n')
        for name in dicBox:
            f.write(name+":管子数：")
            divcGZKey = list(dict.fromkeys(dicBox[name]))
            f.write(str(len(divcGZKey)))
            f.write(json.dumps(divcGZKey, ensure_ascii=False))
            f.write('\n')
        f.write('管码中人数:\n')
        for name in dicBox:
            f.write('箱号'+name+':\n')
            for sample in dicBox[name]:
                f.write(sample+":")
                f.write("人数：")
                f.write(str(len(dicBox[name][sample])))
                f.write(json.dumps(dicBox[name][sample], ensure_ascii=False))
                f.write('\n')
        for name in dicBox:
            generateBoxDetailFile(name)
    fileGenerateError = os.path.join(destPath, 'summaryError')+'.json'
    if os.path.exists(fileGenerateError):
        os.remove(fileGenerateError)
    with open(fileGenerateError, 'w', encoding="utf-8") as f:
        for name in dicBox:
            for sample in dicBox[name]:
                sacnTuble = tubeId.generateInfo(sample, file_name)
                print(sacnTuble)
                if len(dicBox[name][sample]) < len(sacnTuble):
                    f.write(
                        "样本："+sample+"总数"+str(len(dicBox[name][sample]))+"<扫码总数"+str(len(sacnTuble))+"有异常\n")
