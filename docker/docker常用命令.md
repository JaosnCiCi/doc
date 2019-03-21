---
date: 2019-01-14 17:33
status: public
title: docker常用命令
---

1.给运行中的docker容器添加映射：
```
1.docker inspect `container_name` | grep IPAddress
2.iptables -t nat -A  DOCKER -p tcp --dport 8001 -j DNAT --to-destination {IPAddress}:8000
```
2.