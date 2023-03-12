//set up the server
const express = require( "express" );
const logger = require("morgan");
const helmet = require("helmet");
const db = require("./db/db_pool");
const app = express();
const port = process.env.PORT || 8080;

//Configure Express to use certain HTTP headers for security
//Explicitly set the CSP to allow certain sources
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
      }
    }
  })); 

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

app.use(express.urlencoded({extended: false}));
// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));


// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render("index");
} );

// define a route for the stuff inventory page
const read_stuff_all_sql = `
    SELECT 
        id, class as classname, assignment, date
    FROM
    stuff
`
app.get( "/assignments", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.render('assignments',{ inventory : results });
        }
    });
});

// define a route for the item detail page
const read_item_sql = `
    SELECT 
        id, class as classname, assignment, date, description 
    FROM
        stuff
    WHERE
        id = ?
`
app.get( "/assignments/assignmentDetails/:id", ( req, res ) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); 
        else if(results.length==0)
            res.status(404).send(`No item found with id = "${req.params.id}"`);
        else {
            let data = results[0];
            res.render('assignmentDetails', data);
        }
            
    });
});
// define a route for item DELETE
const delete_item_sql = `
    DELETE 
    FROM
        stuff
    WHERE
        id = ?
`
app.get("/assignments/assignmentDetails/:id/delete", ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/assignments");
        }
    });
})
// define a route for item Create
const create_item_sql = `
    INSERT INTO stuff
        (class, assignment, date)
    VALUES
        (?, ?, ?)
`
app.post("/assignments", ( req, res ) => {
    db.execute(create_item_sql, [req.body.name, req.body.assignment, req.body.date], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/assignments/assignmentDetails/${results.insertId}`);
        }
    });
})
// define a route for item UPDATE
const update_item_sql = `
    UPDATE
        stuff
    SET
        class = ?,
        assignment = ?,
        date = ?,
        description = ?
    WHERE
        id = ?
`
app.post("/assignments/assignmentDetails/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.name, req.body.assignment, req.body.date, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/assignments/assignmentDetails/${req.params.id}`);
        }
    });
})
// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );