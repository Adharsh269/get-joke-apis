import express from "express";
import axios from "axios";
const app = express();
const PORT = 3000;

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
const API_URL="https://v2.jokeapi.dev/joke/";
app.get("/",(req,res) => {
    res.render("index.ejs",{content:"Waiting for the data..."});
});

app.post("/get-joke",async (req,res) => {
    //Any or custom
    let cat = req.body.catSelect;

    let flags = req.body.flag || [];
    flags = Array.isArray(flags)?flags.join(','):flags;

    let type = req.body.type || [];

    //if it is custom chang it to array
    if(cat === 'custom'){
        cat = req.body.categories || [];
    }
    //joing all by ,
    const categoryType =Array.isArray(cat)?cat.join(','):cat;
    const params={
        lang:req.body.lang,
        blacklistFlags:flags,
        type:type
    }
    let joke='';
    try{
        //category is not in params is because it is a endpoint
        const result = await axios.get(API_URL+categoryType,{params});
        if(result.data.type  === "single"){
            joke = result.data.joke;
        }else{
            joke = "SetUp: "+result.data.setup+",\n Delivery: "+result.data.delivery;
        }
        res.render("index.ejs",{
            category:result.data.category,
            type:result.data.type,
            joke:joke,
            lang:result.data.lang
        });
    }catch(err){
        res.render("index.ejs",{content:err.message});
    }
});

// app.get("/post-joke",async (req,res) => {

// });

// app.get("/put-joke",async (req,res) =>{

// });

// app.get("/patch-joke",async (req,res) =>{

// });

// app.get("/delete-joke",async (req,res) =>{

// });


app.listen(PORT,() => {
    console.log("Server listening on port",PORT);
});