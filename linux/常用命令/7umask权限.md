# umask默认权限

官方标准算法，umask权限需要进行二进制逻辑与和逻辑非联合运算才可以得到正确的新建文件和目录的默认权限。

人用的计算方法：

- 文件的默认权限最大只能是666，umask的值是022

  “-rw-rw-rw-”减去“-----w--w-”等于“-rw-r--r--”

- 目录的默认权限最大可以是777，umask的值是022

  “drwxrwxrwx”减去“-----w--w-”等于“drwxr-xr-x”



umask配置文件在/etc/profile中

/etc/profile  环境变量配置文件