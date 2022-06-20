#!/usr/bin/env python
# -*- coding:utf-8 -*-
import sys
import os
import json
import io
import argparse
from time import time
import urllib
import csv
import re
from common import *
# from handleFile import *
import logging
import os
import shutil
from pipeline import *
cur_path = os.path.abspath('.')
parent_path = os.path.join(os.path.dirname(__file__), '..')

# python app.py visual dataset-server,basic-data test 1.0.0 false /home/geneseeq 单独测试，不发布
# python app.py visual dataset-server,basic-data test 1.0.0 true /home/geneseeq 测试加发布
# python app.py visual dataset-server,basic-data dev 1.0.0 false /home/geneseeq 开发
# python app.py visual dataset-server,basic-data prod 1.0.0 false /home/geneseeq 运维
# python app.py hdm geneseeq-HDM-runner test 1.0.0 false /home/geneseeq geneseeq-HDM-common,geneseeq-HDM-service,geneseeq-HDM-runner  单独测试，不发布
# python app.py hdm geneseeq-HDM-runner test 1.0.0 true /home/geneseeq geneseeq-HDM-common,geneseeq-HDM-service,geneseeq-HDM-runner 测试加发布
# python app.py hdm geneseeq-HDM-runner dev 1.0.0 false /home/geneseeq geneseeq-HDM-common,geneseeq-HDM-service,geneseeq-HDM-runner 开发
# python app.py hdm geneseeq-HDM-runner prod 1.0.0 false /home/geneseeq 运维
# jenkins的错误通过推出是否为0判断，成功为sys.exit(0),失败sys.exit(1)
# python app.py visual geneseeq-HDM-runner test master false /home/geneseeq/aliyun/ false master true geneseeq-repository true
if __name__ == '__main__':
    # 判断入参个数
    if len(sys.argv) not in [13]:
        logging.error("Input params failed, please retry.")
        sys.exit(1)
    # 构建的工程名字,此处的名字需要和描述代码路径的json文件key相关，譬如：visual
    system_name = sys.argv[1]
    # 构建的模块：a,b,c 譬如：basic-data,dataset-server
    module_str = sys.argv[2]
    module_list = module_str.split(',')
    # 构建的类型：dev/test/prod
    build_type = sys.argv[3]
    # 构建版本，下载代码需要，譬如1.0.0
    version = sys.argv[4]
    # 是否发布，测试流程控制是否发布prod包，值为false/true
    is_publish = sys.argv[5]
    branch_str = "master"
    code_str = sys.argv[10]
    # distribute配置文件路径，譬如：/home/geneseeq/
    distribute_config_path = sys.argv[6]
    # distribute_config = os.path.join(distribute_config_path, 'distribute.json')
    # if not os.path.exists(distribute_config_path):
    #     logging.error("Distribute file path not exist.")
    #     sys.exit(1)
    project_name = sys.argv[12]
    file = os.path.join(cur_path, 'project.csv')
    reader = iter(open(file))
    for line in reader:
        result = line.split(',')
        if(result[0] == project_name):
            project_line = result
    app_service_name = module_str.split(',')[0]
    code_name = code_str.split(',')[0]
    if(project_line[1] != app_service_name or project_line[2] != code_name or project_line[3] != distribute_config_path):
        logging.error("params error."+app_service_name +
                      code_name+distribute_config_path)
        logging.error(project_line)
        sys.exit(1)
    # 是否使用外网docker仓库地址，值为true/false
    is_out_registry = sys.argv[7]
    # print is_out_registry, "+++++++++++++"
    if is_out_registry == 'true':
        docker_registry_ip = "registry.cn-shanghai.aliyuncs.com"
        private_docker_registry_ip = "registry.cn-shanghai.aliyuncs.com"
        # docker_registry_ip = "106.14.107.193:5008"
        # private_docker_registry_ip = "106.14.107.193:5008"
        file_registry_ip = "106.14.107.193:7058"
    else:
        docker_registry_ip = "registry.cn-shanghai.aliyuncs.com"
        private_docker_registry_ip = "registry.cn-shanghai.aliyuncs.com"
        file_registry_ip = "172.16.18.26:7058"
    # is_deploy_test = 'true'
    # 分支名称，默认master
    branch_str = sys.argv[8]
    # 是否部署测试环境，默认true
    is_deploy_test = sys.argv[9]
    # 指定要下载的代码
    code_str = sys.argv[10]
    # 是否全量更新acm配置
    is_full_refresh_acm = sys.argv[11]
    # 发布版本代码库
    release_url = "git@bitbucket.org:geneseeq_china/geneseeq-release.git"
    release_path_dict = {}
    release_path_dict["geneseeq-release"] = release_url
    # 系统目录visual-release
    system_release = "%s-release" % (system_name)
    # 发布版本代码本地路径，譬如/home/geneseeq/project-cicd/code/geneseeq-release
    local_code_home = os.path.join(cur_path, 'code', 'geneseeq-release')
    # 发布版本代码相应版本路径，譬如/home/geneseeq/project-cicd/code/geneseeq-release/visual/version/1.0.0
    local_code = os.path.join(
        cur_path, 'code', 'geneseeq-release', system_release, "version", version)
    # 初始化日志路径,譬如/home/geneseeq/log
    log_file = os.path.join(cur_path, 'log')
    common.is_exist_file(log_file)
    # 文件服务器地址
    # file_registry_ip = "192.168.17.162:7058"

    if build_type not in ["test", "prod", "dev"]:
        logging.error("build type is not support.")
        sys.exit(1)
    # 待构建和发布的代码路径，譬如/home/geneseeq/project-cicd/code/
    code_path = os.path.join(cur_path, 'code')
    # 清空代码路径下所有信息
    # logging.info("Clear %s."%(code_path))
    # common.delete_file_folder(code_path)
    # 测试和开发的情况下，单独做更多的事情
    if build_type == "test" or build_type == "dev":
        # 初始化配置，配置代码下载路径,下载代码
        config_path = os.path.join(cur_path, 'config', 'config.json')
        # services描述文件,需要合并的
        dest_service_config = os.path.join(cur_path, 'config', 'services.json')
        dest_service_path = os.path.join(cur_path, 'config')
        # init config for download code
        if not code_str:
            logging.error('Code not download.')
            sys.exit(1)
        handleFile.delete_json(config_path, system_name, code_str.split(","))
        config_instance = initConfig.Config(config_path)
        # content = config_instance.get_content()
        # common.delete_file_folder(code_path)
        # 获取url字典:{"id":"url"}
        url_dict = config_instance.get_content_by_key(system_name, 'url')
        if not url_dict:
            logging.error('Input url paras is null.')
            sys.exit(1)
        # 下载配置中代码，暂时不使用tag
        logging.info('Begin download code.')
        common.down_code(url_dict, code_path, branch_str)
        logging.info('End download code.')

        # new_code_path = os.path.join(code_path, system_name)
        # 更新代码中的通用配置
        # compile_list = compile_str.split(',')
        src_service_file_list = []
        # 从配置中读取相应系统的config路径
        service_config_path_dict = config_instance.get_content_by_key(
            system_name, 'config')
        for k, v in service_config_path_dict.iteritems():
            # 组装service.json路径，code/geneseeq-repository/LIMSV2/Back-End/mx-visualzation/config/services.json
            src_file_path = os.path.join(code_path, k, v)
            src_service_file = os.path.join(code_path, k, v, 'services.json')
            # 修改各个工程中的配置
            logging.info('Begin refresh service.json. path is: %s' %
                         (src_service_file))
            handleFile.modfiy_json(src_service_file, module_list, version)
            logging.info('Refresh service.json succeed.')
            src_service_file_list.append(src_service_file)
            # cpoy dististure.json
            shutil.copy2(distribute_config, src_file_path)
        # mrege config
        logging.info('Begin merge service.json. dest path is: %s' %
                     (dest_service_config))
        handleFile.merge_json(src_service_file_list, dest_service_config)
        logging.info('Merge service.json succeed.')

        # #auto unittest
        # url_dict = config_instance.get_content_by_key('url')
        # test_script_dict = config_instance.get_content_by_key('unittest')
        # # 执行测试用例，默认代码路径test/test.sh
        # # 函数参数：url字典，code路径，测试脚本路径
        # autoTest.run(url_dict, code_path, test_script_dict)

        # 执行build.sh,构建代码，生成image包或压缩包
        build_script_dict = config_instance.get_content_by_key(
            system_name, 'build')
        logging.info('Begin build, build type is:%s.' % (build_type))
        autoBuild.run(build_script_dict, code_path, build_type,
                      docker_registry_ip, distribute_config_path, is_full_refresh_acm)
        logging.info('End build, build succeed.')
        # 执行package.sh,将部署内容打包成tar包，放到release下
        package_script_dict = config_instance.get_content_by_key(
            system_name, 'package')
        # package_config_dict = config_instance.get_content_by_key('config')
        logging.info('Begin package.')
        autoPackage.run(package_script_dict, service_config_path_dict,
                        file_registry_ip, code_path, build_type)
        logging.info('End package.')
        if build_type == "test" and is_publish == "true":
            # test如果要发布
            logging.info(
                'Need publish pkg release, we need default build type is prod')
            logging.info('Begin build, build type is:prod.')
            autoBuild.run(build_script_dict, code_path, "prod",
                          docker_registry_ip, distribute_config_path, is_full_refresh_acm)
            logging.info('End build, build succeed.')
            # 将部署内容打包成tar包，放到release下
            # package_script_dict = config_instance.get_content_by_key(system_name, 'package')
            logging.info('Begin package. package type is:prod.')
            autoPackage.run(package_script_dict, service_config_path_dict,
                            file_registry_ip, code_path, "prod")
            logging.info('End package.')
            # 将发布清单更新的库中
            logging.info('Publish release description json file.')
            logging.info('Begin download code.')
            common.down_code(release_path_dict, code_path, "master")
            logging.info('End download code.')
            if not os.path.exists(local_code):
                logging.error('File path %s not exist.' % (local_code))
                sys.exit(1)
            shutil.copy2(dest_service_config, local_code)
            if not os.path.isfile(dest_service_config):
                logging.error('File path %s not exist.' %
                              (dest_service_config))
                sys.exit(1)
            logging.info('Begin update git release code.')
            common.update_code(local_code_home)
            logging.info('End upload git release code.')
        # test和dev,配置需要从project-cicd中获取和传入参数获取，判断是否部署测试环境
        if is_deploy_test == 'true':
            logging.info('Refer to distribute.json and begin deploy.')
            autoDeploy.run(file_registry_ip, private_docker_registry_ip,
                           dest_service_path, build_type, distribute_config_path, module_list)
            logging.info('End deploy, congratulations.')

    # 自动化部署, 配置需要从geneseeq-release中获取和传入参数获取
    if build_type == "prod":
        # 获取发布清单,更新到config中
        logging.info('Begin download code.')
        common.down_code(release_path_dict, code_path, "master")
        logging.info('End download code.')
        # common.update_code(local_code_home)
        # new_code_path = os.path.join(code_path, k)
        if not os.path.exists(local_code):
            logging.error('File path %s not exist.' % (local_code))
            sys.exit(1)
        logging.info('Refer to distribute.json and begin deploy.')
        autoDeploy.run(file_registry_ip, private_docker_registry_ip,
                       local_code, build_type, distribute_config_path, module_list)
        logging.info('End deploy, congratulations.')
