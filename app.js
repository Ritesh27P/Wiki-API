const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.set('view engine', 'ejs');

// Mongoose Code
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')

const WikiSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', WikiSchema);

app.route('/articles')
    .get( (req, res)=>{
        Article.find( (err, foundArticles)=>{
            if (!err){
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })

    .post((req, res)=>{

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save();
    
        res.redirect('/articles')
    })

    .delete((req, res)=>{
        Article.deleteMany((err)=>{
            if(err) console.log(err);
            else console.log("Successfully deleted all articles");
        })
        console.log('S')
    })


app.route('/articles/:title')
    .get( (req, res)=>{
        Article.find({title: req.params.title}, (err, data)=>{
            if(data) res.send(data);
            else res.send("No article matching that title was found!")
        })
    } )

    .put( (req, res)=>{
        Article.updateOne(
            {title: req.params.title},
            {title: req.body.title, content: req.body.content},
            // {overwrite: true},
            (err, result)=>{
                if(err) console.log(err)
                else res.send('Successfully updated article')
            }
            
            )
    })

    .patch( (req, res)=>{
        Article.updateOne(
            {title: req.params.title},
            {$set: req.body},
            (err)=>{
                if(err) res.send(err)
                else res.send("Successfully updated article.")
            }

        )
    })

    .delete( (req, res)=>{
        Article.deleteOne({title: req.params.title}, (err)=>{
            console.log(err);
        })
        res.send("successfully deleted the data")
    })

app.listen(3000, ()=>{
    console.log("Sever is hosted on localhost:3000")
})
