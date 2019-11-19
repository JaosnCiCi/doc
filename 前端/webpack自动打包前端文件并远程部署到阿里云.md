1.使用webpack自动打包。
2.在打包成功后的回调函数中使用oss上传到阿里云
ps:注意问题，打包成功后回调函数中，可能还未写盘成功，导致上传文件有遗漏。
```
webpack(webpackConfig, (err, stats) => {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'));
        /**上传oss
        */
        const ossAli=require("../oss.js").ossAli;
        setTimeout(() => {
            console.log("wait for two second");
            ossAli("dev");
        }, 10000);
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
//上传oss
const fs = require('fs');
const co = require('co');
const path = require('path');
const oss = require('ali-oss');

const store = oss({
    region: 'oss-cn-shanghai',
    accessKeyId: '********',
    accessKeySecret: '******',
    bucket: 'geneseeq-statics',
  });
  const ossAli=(dir) => {
    if(dir=="dev"){
      store.list({
        prefix: 'public/static/'+dir
      }).then(res=>{
          console.log(res);
          res.objects instanceof Array&&res.objects.forEach(element => {
              if(element.url){
                console.log(element.name);
                store.delete(element.name);
              }
            
          });
      });  
    }
    const root = path.resolve(__dirname, './dist');
    console.log(root);
    const files = [];
    //递归取出所有文件夹下所有文件的路径
    function readDirSync(p) {
      const pa = fs.readdirSync(p);
      pa.forEach((e) => {
        const cur_path = `${p}/${e}`;
        const info = fs.statSync(cur_path);
        if (info.isDirectory()) {
          readDirSync(cur_path);
        } else {
          files.push(cur_path);
        }
      });
    }
    readDirSync(root);
    store.deleteBucket('helloworld').then((result) => {});
    co(function* () {
      //遍历文件
      for (let index = 0; index < files.length; index += 1) {
        const e = files[index];
        const result = yield store.put(e.replace(root, 'public'), e);
        //提交文件到oss，这里要注意，阿里云不需要创建新文件夹，只有有路径，没有文件夹会自动创建
        console.log(result);
      }
    });
  };
  module.exports={ossAli:ossAli}
```