# Git使用

## 分支开发流程

简述#

- 新建立功能分支，并把分支推送到远程代码仓库。这个动作也可以在gitlab网页上操作。

- 功能开发：必须新建分支

- 单元测试

- 代码规范保障

- 提交到本地分支，远程分支

- gitlab上船创建merge request，指定评审人员，申请代码review

  

### 实施步骤

1.功能开发负责人建立分支myfeature

```
git clone git@192.168.9.91:dbgong/RECMS.git

cd RECMS

git checkout -b myfeature origin/view-dev

git push -u origin myfeature
```

以上实例是默认从view-dev分支建立的myfeature特性分支

请按照实际开发的功能设置分支的名称，替换实例中的myfeature

如果是重其他功能分支建立的需要额外步骤：

```
git pill origin

git checkout -b myfeature origin/myfeature

编写代码

单元测试

代码规范调整

git add

git commit

git push origin myfeature
```

请按照实际开发的功能设置分支的名称，替换示例中的myfeature

2.其他开发人员下载代码，并在分支myfeature上开发新功能

```
git clone git@192.168.9.91:dbgong/RECMS.git

git checkout myfeature

git config user.name "Cici"

git config user.email "501981226@qq.com"
```

3.测试新功能并提交

```
//添加单元测试，执行测试，保证测试通过
//编写单元测试代码（可在开发之前编写）
//调整代码规范
//本地提交代码
git commit -am "develop user2 for myfeature"
//同步主分支代码
git pull
git merge view-dev
//解决冲突
//提交到远程代码
git push
```

4.创建merge request选择左侧merge request，按照指引建立merge request ，微信通知评审人员，步骤2和3可以无限次进行，直到新功能开发完成，并完成单元测试为止。当新功能开发完成后，需要在gitlab网页上创建合并请求。提交merge request的目的是为了发起代码评审流程。检查merge request测试结果。

5.代码评审

- 合并请求可以指定具有master角色的用户进行review

  如果review通过，则直接会把新功能合并到代码主干

  如果review不通过，则评审人员可以直接关闭这个merge request。等待开发者重新修改代码，并重新提交merge request

- 评审过程中，可以直接在gitlab网页上，对着代码写上评审意见。这些评审意见对应的开发者都会看到。

6.更新代码

当新功能合并到代码主干后，其他开发人员可以更新服务器上的最新代码到自己本地的工作副本中。

```
git pull origin

git merge view-dev
```





## 解决冲突

1. 先 git checkout cfiecdns-dev 分支 
2. git pull
3. git checkout 自己分支
4. git merge origin/cfiecdns-dev
5. 解决冲突

