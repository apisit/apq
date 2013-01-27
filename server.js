var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});






app.get('/:searchIndex/:query',function(req,res){

var fs=require('fs');
var sys = require('sys'),
    OperationHelper = require('apac').OperationHelper;



var opHelper = new OperationHelper({
    awsId:     '',
    awsSecret: '',
    assocId:   'apmo0d-20',
});
var searchtime =  Date.now();
console.log(searchtime  + " " + req.params.query);

opHelper.execute('ItemSearch', {
    'SearchIndex': req.params.searchIndex,
    'Keywords': req.params.query,
    'ResponseGroup': 'Large',
    'ItemPage':req.query["p"]==null?1:req.query["p"]
}, function(error, results) {
    if (error) { sys.print('Error: ' + error + "\n") }
    var htmlResult="";
  //  sys.print("Results:\n" + results.ItemSearchResponse.Items[0] + "\n");
// console.log(results.ItemSearchResponse.Items[0].TotalPages);
// console.log(results.ItemSearchResponse.Items[0].MoreSearchResultsUrl);

 var count =results.ItemSearchResponse.Items[0].TotalResults;
//console.log(count);

var itemTemplate = "<div class=\"box photo\" title=\"{alt}\"><a  href=\"http://www.amazon.com/dp/{asin}?tag=apmo0d-20\"><img src=\"{image}\"/><p>{text}</p></a></div>";
if (count>0){


for(i =0;i<10;i++){
	//htmlResult+=results.ItemSearchResponse.Items[0].Item[i].ASIN +"<br/>";
 	htmlResult+=itemTemplate.replace("{text}", results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title);
 	htmlResult=htmlResult.replace("{alt}", results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].Title);
 	htmlResult=htmlResult.replace("{asin}", results.ItemSearchResponse.Items[0].Item[i].ASIN);
  if (results.ItemSearchResponse.Items[0].Item[i].LargeImage!=null){

	htmlResult=htmlResult.replace("{image}", results.ItemSearchResponse.Items[0].Item[i].LargeImage[0].URL);
  }
	// var price;
 // 	if (results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice!=null)
 // 	price= results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice[0].FormattedPrice;
	// else
	// price =results.ItemSearchResponse.Items[0].Item[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice;
	// htmlResult+=price +"<br/>";
 	//htmlResult+=results.ItemSearchResponse.Items[0].Item[i].ItemAttributes[0].ListPrice;
 }//end for loop
 }else{
htmlResult= results.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message;

 }

fs.readFile('template.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
 htmlResult=data.replace("{product}",htmlResult);
 htmlResult=htmlResult.replace("{title}",req.params.query);
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', htmlResult.length);
   res.end(htmlResult);
});

	
});


});

app.listen(3000);
console.log('Listening on port 3000');