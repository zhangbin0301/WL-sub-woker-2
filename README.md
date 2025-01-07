# woker节点订阅管理系统

使用说明:

1.你需要绑定变量名为URL_STORE和SUB2_STORE的2个KV空间

   1.1左侧栏找 存储和数据--KV
   
   1.2右侧找到 创建  分别创建URL_STORE和SUB2_STORE
   
   1.3回到Workers 和 Pages 对应项目里。设置--绑定
   
   1.3找到添加  分别添加KV命名空间---变量名称RL_STORE和SUB2_STORE 命名空间URL_STORE和SUB2_STORE

   
2.原始节点优选ip要设置为ip.sb,端口443，才能实现自动更换

3.节点有2种添加方式，一是自动上传，二是添加自定义节点链接

4.把节点上传地址填入玩具脚本SUB_URL变量里面，可以自动上传节点，生成节点订阅

玩具脚本地址:https://github.com/dsadsadsss/java-wanju.git



## 后台管理地址:  /sub-uuid   uuid为变量
