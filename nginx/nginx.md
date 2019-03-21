---
date: 2018-10-31 15:21
status: public
title: nginx
---

##nginx安装
```
环境工具 CentOS  yum
 sudo yum install -y nginx
```
##nginx默认配置信息位置
###网站文件存放默认目录
```
/usr/share/nginx/html
```
###网站默认站点配置
```
/etc/nginx/conf.d/default.conf
```
###网站站点配置
```
/etc/nginx/conf.d/*
```
###Nginx全局配置
```
/etc/nginx/nginx.conf
```
##nginx.conf文件解读，基于order.geneseeq.com上的nginx
```
#用户
user www-data;
#nginx进程,一般设置为和cpu核数一样
worker_processes auto;
#进程pid存放位置
pid /run/nginx.pid;
#工作模式及连接数上限
events {
  #单个后台worker process进程的最大并发链接数
	worker_connections 768;
	# multi_accept on;
}

http {

	##基础设定
	# Basic Settings
	##

	sendfile on;#开启高效传输模式
   #激活tcp_nopush参数可以允许把httpresponse header和文件的开始放在一个文件里发布，
     积极的作用是减少网络报文段的数量	
	tcp_nopush on;
	tcp_nodelay on;#激活tcp_nodelay，内核会等待将更多的字节组成一个数据包，从而提高I/O性能
	keepalive_timeout 65;#连接超时时间，单位是秒
	#为了快速寻找到相应MIME type，Nginx使用散列表来存储MIME type与文件扩展名                          #types_hash_bucket_size 设置了每个散列桶占用的内存大小。
	#影响散列表的冲突率。types_hash_max_size越大，就会消耗更多的内存，但散列key的冲突率会降低，           #检索速度就更快。types_hash_max_size越小，消耗的内存就越小，但散列key的冲突率可能上升。
	#types_hash_max_size 2048;
	# server_tokens off; #隐藏响应header和错误通知中的版本号

	# server_names_hash_bucket_size 64; #设定请求缓存 
	#如果server_name_in_redirect为off时，那么将会以当前服务器的IP地址进行拼接URL；如果该命令为on，那么首先查找server_name，如果没有找到，查找请求头的HOST字段，如果没有，则以当前服务器的IP进行拼接
	# server_name_in_redirect off;

   #文件扩展名与类型映射表
	include /etc/nginx/mime.types;
	#默认文件类型
	default_type application/octet-stream;

	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;#启动加密算法

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;
	gzip_disable "msie6";

	# gzip_vary on;
	# gzip_proxied any;
	# gzip_comp_level 6;
	# gzip_buffers 16 8k;
	# gzip_http_version 1.1;
	# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	##
	# Virtual Host Configs
	##
   #站点配置   
	include /etc/nginx/conf.d/*.conf;
	##站点地址配置
	include /etc/nginx/sites-enabled/*;
}


#mail {
#	# See sample authentication script at:
#	# http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
# 
#	# auth_http localhost/auth.php;
#	# pop3_capabilities "TOP" "USER";
#	# imap_capabilities "IMAP4rev1" "UIDPLUS";
# 
#	server {
#		listen     localhost:110;
#		protocol   pop3;
#		proxy      on;
#	}
# 
#	server {
#		listen     localhost:143;
#		protocol   imap;
#		proxy      on;
#	}
#}
```
##站点地址配置
```
一般在/etc/nginx/sites-enabled包含n个软连接指向/etc/nginx/sites-available中的对应文件
一般约定每个service提供一个文件
如需要监听test.geneseeq.com和order.geneseeq.com
应创建两个文件test.geneseeq.com和order.geneseeq.com以方便管理
test.geneseeq.com内容
server{
        listen 80;
        server_name www.geneseeq.com;
       location...
}
```

