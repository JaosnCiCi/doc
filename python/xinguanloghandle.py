
# -*- coding: UTF-8 -*-
import sys
import os
import json
import io
import argparse
from time import time
import urllib
import csv
import re
current_path = os.path.abspath(__file__)
parent_path = os.path.join(os.path.dirname(__file__), '..')
destPath = os.path.join(parent_path, 'python', 'logjson')
fileName = os.path.join(parent_path, 'trans.csv')
dicArr = []
divcGZ = []
divcGZDic = {}


def generateFile(entityString, timeString):
    entity = json.loads(entityString)
    # 获取盒子编号
    entity = entity['entity']
    boxNo = entity['boxNo']
    dic = {}
    dic["时间"] = timeString
    dic["管子信息"] = []
    dic["管子数"] = len(entity['samplingContentList'])
    # dic["管子人数"] = 0
    for gz in entity['samplingContentList']:
        divG = {}
        divG["管码"] = gz['sampleNo']
        divG["管中人数"] = len(gz['ncvParticipantReportTList'])
        # dic["管子人数"] += len(gz['ncvParticipantReportTList'])
        dic["管子信息"].append(divG)
        # dic["DF0000076172"] = []
        # print(dic)
        # print(dic["管子信息"])
        # print(dic["DF0000076172"])

        print(divcGZDic)
        keyName = gz['sampleNo']+''
        print("keyName")
        print(keyName)
        print(keyName not in divcGZDic.keys())
        if keyName not in divcGZDic.keys():
            print("keyName1")
            divcGZDic[keyName] = []
        for sc in gz['ncvParticipantReportTList']:
            divcGZDic[keyName].append(sc['idcardCode'])
        divcGZ.append(gz['sampleNo'])
    dicArr.append(dic)
    fileName = boxNo+timeString
    fileGenerate = os.path.join(destPath, fileName)+'.json'
    if os.path.exists(fileGenerate):
        os.remove(fileGenerate)
    with open(fileGenerate, 'w', encoding="utf-8") as f:
        #  f.write(json.dumps(entityString, indent=4, ensure_ascii=False))
        f.write(json.dumps(entity, indent=4, ensure_ascii=False))


def parse_service_config(file_name):
    file = os.path.join(parent_path, 'python', 'log', file_name)
    reader = iter(open(file))
    for line in reader:
        if line.find("/lim/api/ncov/lab/sampling/updateBox") > -1:
            result = re.findall(
                r"{\"entity\":{\"samplingId\"[\s\S]*}]}}", line)
            times_result = re.findall(
                r"(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2})", line)
            if(len(result) > 0):
                generateFile(result[0], times_result[0].replace(' ', '-'))

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
        for name in dicArr:
            f.write(json.dumps(name, ensure_ascii=False))
            f.write('\n')
        divcGZKey = list(dict.fromkeys(divcGZ))
        f.write('管码并集(用于管码丢失情况):')
        f.write(json.dumps(divcGZKey, ensure_ascii=False))
        for name in divcGZDic:
            f.write('\n')
            f.write(name+":")
            f.write("人数：")
            f.write(str(len(list(dict.fromkeys(divcGZDic[name])))))
            f.write(json.dumps(
                list(dict.fromkeys(divcGZDic[name])), ensure_ascii=False))
