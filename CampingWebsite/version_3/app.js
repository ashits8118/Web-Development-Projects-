var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose=require("mongoose");
var CampingGround = require("./models/campground.js");
var seedDB = require("./seeds.js");



mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));

seedDB();

app.get("/",function(req,res){
  res.render("home.ejs");
});

app.get('/campgrounds',function(req,res){
       //get all campgrounds from DB
       CampingGround.find({},function(err,allCampgrounds){
           if(err){
               console.log(err)
           }
           else {
               res.render("camps.ejs",{campgrounds:allCampgrounds})
               
           }
       })
       
});

app.post("/campgrounds",function(req,res){
    // get data from forms and add to campground array
    var name = req.body.name;
    var image= req.body.image;
    var description=req.body.description;
    var newCampinggrounds ={name:name,image:image,description: description};
    
     //create a new campground and save it to DB
  CampingGround.create(newCampinggrounds,function(err,newCampinggrounds){
      if(err){
          console.log(err)
      }
      else{
          //redirect back to campgrounds page
    res.redirect("/campgrounds")
      }
  })
    
})

app.get('/campgrounds/new',function(req, res) {
    res.render("new.ejs");
});

// show us one info abou the campground.
app.get("/campgrounds/:id",function(req, res) {
     CampingGround.findById(req.params.id).populate("comments").exec(function(err,foundCampgrounds){
        if(err){
            console.log(err)
        }
        else{
                //render show template with that campground
                  console.log(foundCampgrounds);
                  res.render("show.ejs",{foundCampgrounds})
        }
    })
});


app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The Camping Ground WebSite has started!!");
});