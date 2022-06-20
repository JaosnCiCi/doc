
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
tubleId = ''


def parse_service_config(file_name, tubleId):
    dicArr = []
    file = os.path.join(parent_path, 'python', 'log', file_name)
    findTuble = "?tubeId="+tubleId+"]"
    rTuble = "/detailById/[\s\S]+?tubeId="+tubleId
    reader = iter(open(file))
    for line in reader:
        if line.find(findTuble) > -1:
            result = re.findall(
                r""+rTuble+"", line)
            if(len(result) > 0):
                result1 = result[0].split('?')[0]
                result2 = result1.split('/')
                dicArr.append(result2[-1])
    return dicArr


def generateInfo(tubleId, file_name):
    # dicArr = []
    dicArr = parse_service_config(file_name, tubleId)
    fileName = file_name+'result'
    fileGenerate = os.path.join(destPath, 'tubleIdResult.')+tubleId + '.json'
    if os.path.exists(fileGenerate):
        os.remove(fileGenerate)
    with open(fileGenerate, 'w', encoding="utf-8") as f:
        f.write(json.dumps(list(dict.fromkeys(dicArr)),
                indent=4, ensure_ascii=False))
    # 去重复操作
    return list(dict.fromkeys(dicArr))

    # 生成indx集成文件
if __name__ == "__main__":
    file_name = sys.argv[1]
    print(file_name)

    if len(sys.argv) > 2:
        tubleId = sys.argv[2]
    else:
        tubleId = file_name.split(".")[-1]
    print(file_name)
    # 'difei_helper-web.log.DF0000076172'
    dicArr = parse_service_config(file_name, tubleId)
    fileName = file_name+'result'
    fileGenerate = os.path.join(destPath, 'tubleIdResult.')+tubleId + '.json'
    if os.path.exists(fileGenerate):
        os.remove(fileGenerate)
    with open(fileGenerate, 'w', encoding="utf-8") as f:
        f.write(json.dumps(list(dict.fromkeys(dicArr)),
                indent=4, ensure_ascii=False))
