<div align='center'><img align='center' src='https://leftover-md.oss-cn-guangzhou.aliyuncs.com/img-md/logo1.jpg'/></div>

![GitHub](https://img.shields.io/github/license/left0ver/dq-cli)                   ![npm](https://img.shields.io/npm/v/deployment-quickly)

dq-cli是一个命令行工具，配置项简单，一条命令即可让你将项目部署至windows或者Linux服务器。

# 特点

- 命令行部署项目
- 使用现成的模板搭建项目，迅速搭建起一个规范的项目

# Usage

## 命令行部署项目

1. 本命令行工具支持ssh连接，密码连接服务器的方式，如果您需要适应ssh连接的方式，请先在客户端的电脑上生成对应的ssh密钥对，然后将公钥放到服务器上。当然如果您不想这么麻烦，也可以使用密码的方式。

2. `password` 和私钥二者至少要有一个

3. 部署的时候会自动将服务器中原本的文件夹进行一个备份，备份的文件夹为`[your dirname].bak`

4. 命令行的配置项会覆盖配置文件中相同的配置项

  ```bash
$ dq build --help
   Options:
   Options:
     -H --host [host]              服务器ip
     -p --port [port]              设置ssh连接的端口号,默认是22
     -u --user [username]          服务器登录的用户名,默认root
     -k --privateKey [privateKey]  私钥保存的位置,绝对路径
     -P --PWD [password]           登录密码
     -l --local [localPath]        要上传的文件夹的位置,默认是当前工作目录的dist文件夹
     -d --dest [destination]       要上传的服务器的哪个目录下,必须使用绝对路径
     -o --os [os]                  服务器的操作系统,linux|windows,默认linux
     -c --config [config]          自己选择配置文件的路径
     -h, --help                    display help for command
     
   $ dq -H  10.23.5.8 -p 22 -u root -k C:\Users\ASUS\.ssh\id_rsa_client -P 123456 -l ./dist -d /home/root/ -o linux -c .\config\dq.config.json
   ```
   
   

   ## 使用配置文件

   默认配置文件和配置文件的配置项如下，您可以使用-c指定配置文件路径，默认工作目录下的dq.config.json文件

   ```json
{
       "host": "localhost",
       "username": "root",
       "port": 22,
       "password": "",
       "privateKey": "C:/Users/ASUS/.ssh/id_rsa",
       "localPath":"./dist",
       "remotePath":"",
       "os": "linux"
   }
   ```
   
   ## warn

5. 该工具暂时只在Windows电脑上进行测试（其实是没钱买mac），如需在mac或者Linux上运行，请自测，以后会在Linux测试

6. Windows里面不要使用`bash` 运行，会导致路径对不上，导致部署的文件夹错误

## 拉取模板搭建项目

敬请期待！

# 未来的计划

1. 考虑文件夹压缩部署
2. 增添部署的进度提示
3. 部署之后执行shell脚本

# Licence

dq-cli is used licensed as MIT
