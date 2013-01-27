var express = require('express');
var app = express();


app.get('/',function(req,response){
  var fs=require('fs');
fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
   
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  

});

});




app.get('/:searchIndex/:query',function(req,res){

var fs=require('fs');
var sys = require('sys'),
    OperationHelper = require('apac').OperationHelper;



var opHelper = new OperationHelper({
    awsId:     'AKIAIZD5DU5726UQ4S5Q',
    awsSecret: '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',
    assocId:   'apmo0d-20',
});
var searchtime =  Date.now();
console.log(searchtime  + " "+ req.params.searchIndex + " " + req.params.query + " " + req.query["p"]);

opHelper.execute('ItemSearch', {
    'SearchIndex': req.params.searchIndex,
    'Keywords': unescape(req.params.query),
    'ResponseGroup': 'Medium',
    'ItemPage':req.query["p"]==null?1:req.query["p"]
}, function(error, results) {
    if (error) { 
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', "".length);
      res.end("");
     }

    var htmlResult="";

    var totalPage=parseInt(results.ItemSearchResponse.Items[0].TotalPages);
    //console.log(totalPage);
    //if totalpage < given page then return blank
    var requestPage=parseInt(req.query["p"]);
    if (requestPage>totalPage){
      //console.log("error requestPage>totalPage");
      console.log("%j",results.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message);
      htmlResult="";
    }else{
      var count =parseInt(results.ItemSearchResponse.Items[0].TotalResults);
      //console.log(count);

      var itemTemplate = "<div class=\"box photo\" title=\"{alt}\"><a href=\"http://www.amazon.com/dp/{asin}?tag=apmo0d-20\"><img src=\"{image}\"><p>{text}</p></a></div>";
      if (count==0){
          console.log("no result" + count);
         htmlResult= results.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message;
      }else{
           if (count>10)
            count=10;

          for(i =0;i<count;i++){
            //console.log(i);
           
            if (results.ItemSearchResponse.Items[0].Item[i]!=null){
               htmlResult+=itemTemplate;
               //console.log(results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title);
               var title  = results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title[0];
               title=escape(title);
               //console.log(title);
                htmlResult=htmlResult.replace("{text}", title);
                htmlResult=htmlResult.replace("{alt}", title);
                htmlResult=htmlResult.replace("{asin}", results.ItemSearchResponse.Items[0].Item[i].ASIN);

                if (results.ItemSearchResponse.Items[0].Item[i].LargeImage!=null){
              
                    htmlResult=htmlResult.replace("{image}", results.ItemSearchResponse.Items[0].Item[i].LargeImage[0].URL);
                    //console.log(results.ItemSearchResponse.Items[0].Item[i].LargeImage[0].URL[0]);
                }else{
                    console.log("no image");
                    htmlResult=htmlResult.replace("{image}","http://placehold.it/200x200");
                    //console.log("something wrong : %j", results.ItemSearchResponse.Items[0].Item[i]);
                }
                //console.log(htmlResult + "\n\n");

            }
           
           
            
            // var price;
           //   if (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice!=null)
           //   price= results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice[0].FormattedPrice;
            // else
            // price =results.ItemSearchResponse.Items[0].Item[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice;
            // htmlResult+=price +"<br/>";
            //htmlResult+=results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice;
           }//end for loop
      }//end else count >0

    }
   res.setHeader('Content-Type', 'text/html');
   res.setHeader('Content-Length', htmlResult.length);
   res.end(htmlResult);

	
});


});

app.listen(3000);
console.log('Listening on port 3000');