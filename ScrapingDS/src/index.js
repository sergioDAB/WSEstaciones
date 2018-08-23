const cheerio = require('cheerio');
const fs = require('fs');
const request= require('request');



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
                       if(p.length===3){
                           base=base[0]+"//"+base[2]+"/"+base[3]+"/"+p[2];
                       }else{
                           base=base[0]+"//"+base[2]+"/"+base[3]+"/"+base[3]+p[0];
                       }
                       console.log(base);
                   });
               }
               else {
                   console.log("error con las imagenes "+ url)
               }
           });

       })
   }
});

function guardarImagenFichero (img) {

    img = img.src;
    window.newW = open (img);
    newW.document.execCommand("SaveAs");
    newW.close();
}




//https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js