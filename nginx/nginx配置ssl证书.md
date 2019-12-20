### 直接安装nginx的证书配置
```
 cd /nginx安装目录
 cd /conf/sites-available
 cd 域名对应的配置
 	# SSL
        ssl                  on;
        ssl_certificate      /usr/local/nginx/certs/geneseeq.com/geneseeq.com.pem; 
        ssl_certificate_key  /usr/local/nginx/certs/geneseeq.com/geneseeq.com.key;  
```
### kong-nginx的证书配置
```
   sudo docker cp /home/geneseeq/certs/ dd6c5e698288:/usr/local/kong/ssl/
  sudo docker exec -it dd6c5e698288 /bin/sh
  cd /usr/local/share/lua/5.1/kong/templates
  vim nginx_kong.lua
  if proxy_ssl_enabled then
    ssl_certificate /usr/local/kong/ssl/visions.geneseeq.com.pem;
    ssl_certificate_key /usr/local/kong/ssl/visions.geneseeq.com.key;
    ssl_protocols TLSv1.1 TLSv1.2;
    ssl_certificate_by_lua_block {
        Kong.ssl_certificate()
    }
kong reload
由于kong-ngix 的配置文件是每次启动后更具模板文件自动生成的
因此要修改 templates下nginx_kong.lua文件
```