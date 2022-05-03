<div align='center'><img align='center' src='https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/logo1.jpg'/></div>

![GitHub](https://img.shields.io/github/license/left0ver/dq-cli) ![npm](https://img.shields.io/npm/v/ldq-cli)

dq-cli 是一个命令行工具，配置项简单，既可以一条命令即可让你将项目部署至 windows 或者 Linux 服务器，也可也帮助你搭建迅速搭建一个前端工程化的项目

# 特点

- 命令行部署项目
- 使用现成的模板搭建项目，迅速搭建起一个规范的项目

# 下载

```
 npm i ldq-cli -g
```

> 不要打错了哦

# Usage

```
dq --help

  Commands:
    init             初始化配置文件
    build [options]  将本地的指定文件夹部署到服务器
    help [command]   display help for command
```

### 命令行部署项目

1. 本命令行工具支持 ssh 连接和密码连接服务器两种方式，如果您需要适应 ssh 连接的方式，请先在客户端的电脑上生成对应的 ssh 密钥对，然后将公钥放到服务器上，参考 [教程](https://leftover.cn/2022/04/27/ssh%E5%AF%86%E9%92%A5%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8/)，当然如果您不想这么麻烦，也可以使用密码的方式。

2. `password` 和私钥二者至少要有一个

3. 部署的时候会自动将服务器中原本的文件夹进行一个备份，备份的文件夹为`[your dirname].bak`

4. 命令行的配置项会覆盖配置文件中相同的配置项
5. 使用命令行的-e 选项,在上传完文件夹之后执行某个命令,命令的内容要加**引号**,执行命令是在根目录/下执行的，如果想要在某个具体的目录下执行，可以先 cd 到某个目录，具体情况见下面的 example,如果你想要执行某个 shell 脚本，您可以使用命令`sh [your script path]`

```bash
$ dq build --help

 Options:
-H --host [host]          服务器ip,默认localhost
-p --port [port]              设置ssh连接的端口号,默认是22
-u --user [username]          服务器登录的用户名,默认root
-k --privateKey [privateKey]  私钥保存的位置,绝对路径
-P --PWD [password]           登录密码
-l --local [localPath]        要上传的文件夹的位置,默认是当前工作目录的dist文件夹
-d --dest [destination]       要上传的服务器的哪个目录下,默认为：/,必须使用绝对路径
-c --config [config]          选择配置文件的路径,默认当前工作目录下的dq.config.json文件
-e --exec [command]           上传文件之后在服务器中执行的命令
-h, --help                    display help for command

$ dq -H  10.23.5.8 -p 22 -u root -k C:\Users\ASUS\.ssh\id_rsa_client -P 123456 -l ./dist -d /home/root/ -c .\config\dq.config.json -e 'cd /home/root/dist && npm i'

```

### 使用配置文件

默认配置文件和配置文件的配置项如下，您可以使用-c 指定配置文件路径，默认工作目录下的 dq.config.json 文件

```
{
  "host": "localhost",
  "port": 22,
  "username": "root",
  "privateKey": "",
  "password": "",
  "localPath": "./dist",
  "remotePath": "/",
  "command":""
}

```

## warn

`1. 该工具暂时只在Windows电脑上进行测试（其实是没钱买mac），如需在mac或者Linux上运行，请自测，以后会在Linux测试`

`2. Windows里面不要使用`bash` 运行，会导致路径对不上，导致部署的文件夹错误`

# 未来的计划

1. 新增拉取符合规范的项目模板，帮助您快速构建项目

# Licence

dq-cli is used licensed as [MIT](https://github.com/left0ver/dq-cli/blob/main/LICENSE)
