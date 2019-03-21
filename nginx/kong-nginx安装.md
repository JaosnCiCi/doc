---
date: 2019-02-14 17:45
status: public
title: kong-nginx安装
---

测试前端搭建手册
1.	搭建 kong
Kong作为接口访问的统一入口，使用docker安装，安装步骤如下：
	安装数据库
sudo docker run -d --restart=always --name kong-database \
              -p 5432:5432 \
              -e "POSTGRES_USER=kong" \
              -e "POSTGRES_DB=kong" \
              daocloud.io/library/postgres:9.5
              ps:官网的9.6有问题
	迁移数据
sudo docker run --rm \
    --link kong-database:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \
    daocloud.io/library/kong:latest kong migrations up
	启动kong（安全考虑，限制只有本机访问admin）
sudo docker run -d --restart=always --name kong \
    --link kong-database:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \
    -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
    -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" \
    -e "KONG_ADMIN_LISTEN_SSL=0.0.0.0:8444" \
    -p 80:8000 \
-p 8443:8443 \
-p 443:8443 \
    -p 127.0.0.1:8001:8001 \
    -p 127.0.0.1:8444:8444 \
    daocloud.io/library/kong:latest
	安装dashboard
sudo docker run -d --restart=always -p 8080:8080 pgbi/kong-dashboard:v2
	设置dashboard访问权限
（1）建立admin的lookback
curl http://localhost:8001/apis \
  --data name=admin-api \
  --data uris=/admin-api \
  --data upstream_url=http://localhost:8001
（2）新增basic-auth插件
curl -X POST http://127.0.0.1:8001/apis/admin-api/plugins \
    --data "name=basic-auth" \
    --data "config.hide_credentials=true"
（3）创建消费者
curl -d "username=user123&custom_id=SOME_CUSTOM_ID" http://127.0.0.1:8001/consumers/
（4）新增认证的账号和密码
curl -X POST http://127.0.0.1:8001/consumers/user123/basic-auth \
    --data "username=admin" \
    --data "password=geneseeq"
（5）打开dashboard：Error! Hyperlink reference not valid.

1.1	使用 admin geneseeq 登录 kong，根据配置文档进行配置
2.修改 distribution.json 修改前端服务部署的机器
3.找刘哥配置 test1.geneseeq.com 指向新的 ip

