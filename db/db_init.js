// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

/**** Delete existing table, if any ****/
const drop_stuff_table_sql = "DROP TABLE IF EXISTS stuff;"
db.execute(drop_stuff_table_sql);

/**** Create "stuff" table (again)  ****/
const create_stuff_table_sql = `
    CREATE TABLE stuff (
        id INT NOT NULL AUTO_INCREMENT,
        class VARCHAR(45) NOT NULL,
        assignment VARCHAR(100) NOT NULL,
        date VARCHAR(50) NOT NULL,
        description VARCHAR(1000) NULL,
        userid VARCHAR(50) NULL,
        PRIMARY KEY (id)
    );

`
db.execute(create_stuff_table_sql);

/**** Create some sample items ****/
const insert_stuff_table_sql = `
    INSERT INTO stuff 
        (class, assignment, date, description) 
    VALUES 
        (?, ?, ?, ?);
`
db.execute(insert_stuff_table_sql, ['Intro to WebApp', 'Prototype your app', 'January 6, 2023', 'Similar to the example "Inventory app" prototype, build your own prototype for a more specific inventory-keeping application of your own design. You may either build it largely from scratch (w/ Materialize of course) or start by copying my prototypes, and making edits to customize. Your prototype designs are not final, but they should look close to the way you intend the app to ultimately look']);

db.execute(insert_stuff_table_sql, ['Chemistry', 'Unit 6 Test', 'February 27, 2023', 'Thermodynamics']);

db.execute(insert_stuff_table_sql, ['AP CompSci', 'Test', 'February 10, 2023', 'Polymorphism']);

db.execute(insert_stuff_table_sql, ['Health', 'Homework', 'February 12, 2023',null]);

/**** Read the sample items inserted ****/
const read_stuff_table_sql = "SELECT * FROM stuff";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'stuff' initialized with:")
        console.log(results);
    }
);

db.end();