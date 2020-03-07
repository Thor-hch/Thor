let db = require('../model/db');
module.exports = function (app) {
    app.get('/', function (req, res) {
      let obj = {
        city:'阳泉',
        coin:100,
        gender:0,
        headUrl:'123456',
        nickname:'贺',
        province:'山西',
        region:'中国',
        telephone:'12345678',
        userId:321654,
        isbeginAudio:true,
      }
      res.type('application/json');
      res.status(200);
      res.append('Access-Control-Allow-Origin', "*");
      res.jsonp(obj);
      return;
    });

    app.get('/login',function(req, res){
      res.append('Access-Control-Allow-Origin', "*");
      const data = req.query;
      let sqlString = 'select * from userdata where userid = '+data.id.toString()+';';
      let connection = db.connection();
      db.get(connection,sqlString,function(data){
        console.log('data',data.length);
        if(data.length>2){//存在数据，返回客户端
          res.jsonp(JSON.parse(data));//Convert String to JSON object 
        }else{
          console.log('ccc');
          db.close(connection);
          let connection_a = db.connection();
          let project = {maxScore:0,maxLevel:1,audio:1};
          let sqlstring = 'INSERT INTO userdata SET ?';
          db.insert(connection_a, sqlstring, project, function(id){//新建一个用户的数据
            console.log('inserted id is:' + id);
            db.close(connection_a);
            let connection_b = db.connection();
            db.get(connection_b,sqlString,function(data){//新建之后再返回到客户端
              res.jsonp(JSON.parse(data));//Convert String to JSON object 
            })
          });
        }
      })
      db.close(connection);
      return;
    });


    app.get('/register',function(req,res){
      res.append('Access-Control-Allow-Origin', "*");
      const data = req.query;
      let project = {userid:data.id,maxScore:0,maxLevel:1,audio:1};
      var insertSql = 'INSERT INTO userdata SET ?';
      let sqlString = 'select * from userdata where userid = '+data.id.toString()+';';
      let connection = db.connection();

      function regfun(){
        db.insert(connection,insertSql,project,function(data){
          console.log('data',data);
        })
      }

      db.get(connection,sqlString,function(data){
        console.log('data123',data.length);
        if(data.length<=2){//data打印值为[]，此处length为取巧，如何判断是否有返回?.
          regfun();
          let obj = {
            code:1,
            msg:'注册成功',
          }
          res.jsonp(obj);
        }else{
          let obj = {
            code:-1,
            msg:'用户名存在',
          }
          res.jsonp(obj);
        }
      })
    })

    app.get('/select',function(req,res){
      const data = req.query;
      let sqlString = 'select * from userdata where userid = '+data.id.toString()+';';
      let connection = db.connection();
      res.append('Access-Control-Allow-Origin', "*");
      db.get(connection,sqlString,function(data){
        if(data.length<=2){
          let obj = {
            code:-1,
            msg:'用户名不存在',
          }
          res.jsonp(obj);
        }else{
          res.jsonp(JSON.parse(data));//Convert String to JSON object 
        }
      })
      db.close(connection);
    })

    app.get('/update',function(req,res){
      const data = req.query;
      console.log('update data123',data);
      let sqlString = 'update userdata set maxLevel = '+data.maxLevel.toString()+', maxscore = '+
      data.maxScore.toString()+', audio = '+data.audio.toString()+ ' where userid = '+data.id.toString()+';';
      let connection = db.connection();
      res.append('Access-Control-Allow-Origin', "*");
      db.get(connection,sqlString,function(data){
        console.log('update data',data);
      })
      db.close(connection);
    })

    app.get('/ranking',function(req,res){
      let sqlString = 'SELECT * FROM userdata.userdata;';
      let connection = db.connection();
      res.append('Access-Control-Allow-Origin', "*");
      db.get(connection,sqlString,function(data){
        res.jsonp(JSON.parse(data));
      })
      db.close(connection);
    })
  };