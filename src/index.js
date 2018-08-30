const cheerio = require('cheerio');
const fs = require('fs');
const request= require('request');


let noDwld=["qnhpave.png", "qnhlib07.png",  "qnhajsm07.png"];

disponible=function(palabra,lista){
    for(let i=0; i< lista.length; i++){
        if(palabra===lista[i]) return false;
    }
    return true;
};

request('https://www.imn.ac.cr/estaciones-automaticas', async(err, res, body)=>{
   if(!err && res.statusCode === 200){
       let $ = cheerio.load(body);
       $('a','table.table' ).each(function () {
           let url = $(this).attr('href');

           let u= url.split(":");
           if(u[0]=== "http" || u[0]==="https"){
               url= u[0]+ ":"+ u[1];
           }else{
               url="http:"+u;
           }

           console.log(url);

            request(url,(error,result,cuerpo)=>{

               if(!error && result.statusCode ===200){
                   let i =cheerio.load(cuerpo);
                   i('img').each(function () {
                       let image =i(this).attr('src');
                       let p=image.split("/");
                       let base=url.split("/");
                       if(p.length===3 ){
                           if(disponible(p[2],noDwld)){
                               base=base[0]+"//"+base[2]+"/"+base[3]+"/"+p[2];
                                download(base,p[2],function () {
                                    console.log("done");
                                });
                               //console.log("base1: "+ base);
                           }

                       }else{
                           base=base[0]+"//"+base[2]+"/"+base[3]+"/"+p[0];
                          download(base,p[0],function () {
                               console.log("done");
                           });
                           //console.log("base2: "+ base); //
                       }

                   });
               }
           });

       })
   }
});

let download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};



//https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js