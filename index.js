var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/calc', function(request, response) {
    getEnteredValues(request,response,calculateRate);
    response.render('pages/results');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getEnteredValues(request,response,calculateRate){
    querystr= url.parse(request.url, true).query;
    var type= querystr['type'];
    var weight= parseFloat(querystr['weight']);
     console.log(type);
    console.log(weight);
    calculateRate(response,type, weight);
   
}

function calculateRate(response,type,weight){
    var price = 0.00;
    var round_weight = Math.round(weight);
    switch(type){
            
        //Parcel
        case "pl":
        //if rounded package weight is <=4, price is $2.67 
            //otherwise, base price = $2.67 + any rounded amount over 4 * .18 
            if (round_weight<=4){
                price=2.67;
            }else{
                price=2.67 + ((round_weight-4) * .18);
            }
                
        break;
            
        //Postcard    
        case "pc":
        //ANY - 0.34    
            price = .34;
            break;
            
        //Large Envelope    
        case "le":
        //base price = .98 + any rounded amount over 1 * .21
            price = .98 + ((round_weight-1) * .21);
            break;
            
        //Stamped Letter    
        case "sl":
        //.49 + 21cents per ounce over 1 and anything over 3.5 ounces is 1.12
            if(round_weight >= 4){
                price = 1.12;
            }else{
                price = .49 + ((round_weight - 1) * .21)
            }
            break;
            
        //Metered Letter    
        case "ml":
        //3.5 or higher is 1.09 otherwise 46 + 21 cents per rounded ounce over 1
            if(round_weight >=4){
                price = 1.09;
            }else{
                price = .46 + ((round_weight - 1) * 21);
            }
            break;
    }
    var params = {price: price.toFixed(2), weight: weight, type: type };
    response.render('pages/results',params);
}
