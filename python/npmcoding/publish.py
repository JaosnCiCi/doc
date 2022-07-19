from codeop import CommandCompiler
from distutils import command
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
parent_path = os.path.dirname(__file__)
destPath = os.path.join(parent_path, 'node_modules')
originfile = os.path.join(parent_path, '.npmrc')
if __name__ == "__main__":
    # for root, dirs, files in os.walk(".", topdown=False):
    #     for name in files:
    #         print(os.path.join(root, name))
    #     for name in dirs:
    #         print(os.path.join(root, name))
    dirs = os.listdir(destPath)
    print(originfile)
    for dir in dirs:
        targetDir = os.path.join(destPath, dir)
        tragetfile = os.path.join(destPath, dir, '.npmrc')
        commandcp = 'cp '+originfile + ' ' + tragetfile
        commandPub = " npm publish --registry=https://geneseeq-npm.pkg.coding.net/geneseeq/front/"
        print(commandPub)
        os.popen(commandcp)
        os.chdir(targetDir)
        os.popen(commandPub)
