cd /usr/local/
sudo mkdir newnginx
cd newnginx/
sudo wget http://nginx.org/download/nginx-1.20.2.tar.gz
cd nginx-1.20.2/
sudo ./configure --prefix=/usr/local/nginx3 --sbin-path=/usr/sbin/nginx3 --conf-path=/etc/nginx3/nginx.conf --error-log-path=/var/log/nginx3/error.log --http-log-path=/var/log/nginx3/access.log --pid-path=/var/run/nginx3.pid --lock-path=/var/run/nginx3.lock --http-client-body-temp-path=/var/tmp/nginx3/client --http-proxy-temp-path=/var/tmp/nginx3/proxy --http-fastcgi-temp-path=/var/tmp/nginx3/fcgi --http-uwsgi-temp-path=/var/tmp/nginx3/uwsgi --http-scgi-temp-path=/var/tmp/nginx3/scgi --user=nginx3 --group=nginx3 --with-pcre --with-http_v2_module --with-http_ssl_module --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_random_index_module --with-http_secure_link_module --with-http_stub_status_module --with-http_auth_request_module --with-mail --with-mail_ssl_module --with-file-aio --with-ipv6 --with-http_v2_module --with-threads --with-stream --with-stream_ssl_module
make && make install
mkdir -pv /var/tmp/nginx3/client
groupadd -r nginx3
cd /etc/nginx
cp -ri nginx/\* /etc/nginx3
apt-get install zlib1g
apt-get install libpcre3 libpcre3-dev
apt-get install openssl libssl-dev
vim /etc/nginx/sites-enable/defalut

```
删除ssl on
改为 listen 443 ssl;
```
