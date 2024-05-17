const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const databasePath = path.join(__dirname, "movies.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    await database.run(`
      CREATE TABLE IF NOT EXISTS movie (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        img TEXT NOT NULL,
        summary TEXT NOT NULL
      )
    `);
   /* const moviesData = [
        {
          name: "Harry Potter and the Order of the Phoenix",
          img: "https://bit.ly/2IcnSwz",
          summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
        },
        {
          name: "The Lord of the Rings: The Fellowship of the Ring",
          img: "https://bit.ly/2tC1Lcg",
          summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
        },
        {
          name: "Avengers: Endgame",
          img: "https://bit.ly/2Pzczlb",
          summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos."
        }
      ];
  
      const insertMovieQuery = await database.prepare("INSERT INTO movie (name, img, summary) VALUES (?, ?, ?)");
      
      
      for (const movie of moviesData) {
        await insertMovieQuery.run(movie.name, movie.img, movie.summary);
      }
  
      await insertMovieQuery.finalize();*/
    app.listen(3005, () =>
      console.log("Server Running at http://localhost:3005/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

// create operation using post method
app.post("/movies/",async(request,response)=>{
    const {name,img,summary}=request.body
    const postMovieQuery=`INSERT INTO 
    movie(name,img,summary)
    VALUES
    ('${name}','${img}'${summary}')
    `;
    await database.run(postMovieQuery)
    response.send("movie added successfully")
})

//read operation
app.get("/movies/",async(request,response)=>{
    const getMoviesQuery=`
    SELECT
    *
    FROM movie;
    `;
    const mv=await database.all(getMoviesQuery)
    response.send(mv)
})

//update

app.put("/movies/:id/", async(request,response)=>{
    const {name,img,summary}=request.body
    const {id}=request.params
    const updateMovieQuery=`
    UPDATE
    movie
    SET
    name='${name}',
    img='${img}',
    summary='${summary}'
    WHERE
    id=${id}

    `;
    await database.run(updateMovieQuery)
    response.send("movie details updated")
})

//delete
app.delete("/movies/:id/",async(request,response)=>{
    const {id}=request.params;
    const deleteMovieQuery=`
    DELETE FROM
    movie
    WHERE
    id=${id}

    
    `;
    await database.run(deleteMovieQuery)
    response.send("movie deleted")
})

initializeDbAndServer();

