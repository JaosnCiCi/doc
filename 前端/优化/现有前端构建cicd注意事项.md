在前段提供正确脚本情况下，测试环境CICD配置流程。

1.  配置构建参数code，app_service

>   选择工程test_visual13,选择配置，在参数化构建过程中选择参数化构建过程，配置code，app_service如下图。

![](media/bf05159b992bff4f326e8fa7a396ede1.png)

![](media/0864bb472f1434f7843fe8477eaa1b73.png)

![](media/898dd99dfc59ce254ef4fd9b1e096d6f.png)

1.  配置project-cicd

>   Git地址 git clone
>   [git\@bitbucket.org:geneseeq_china/project-cicd.git](git@bitbucket.org:geneseeq_china/project-cicd.git)

>   修改config.json文件

![](media/770bb59b87fa3e27bbd2c41bb32f3523.png)

1.  将id和服务器配置到distribute.json

2.  distribute.json所在服务器192.168.0.61 用户名：genseeq 密码 geneseeq

3.  cd /home/geneseeq/sunyuhua

4.  修改distribute.json

![](media/cbddf4b01581386bebd2ef876cb23809.png)

>   注意点：distribute.json,config.json中的id与code中变量名称，app_service中变量名称都要保持一致
