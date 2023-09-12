const express = require("express");
const path = require("path");

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const databasePath = path.join(__dirname, "cricketTeam.db");

let database = null;

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

let convertDbObjectToResponseObject = (dbObject) => {
    return {
            playerId: dbObject.player_id,
            playerName: dbObject.player_name,
            jerseyNumber: dbObject.jersey_number,
            role: dbObject.role,
        };
};

app.get("/players/", async (request,response)=>{
    let a = `SELECT * FROM cricket_team`;
    let b = await database.all(a)
    response.send(b.map(i) => convertDbObjectToResponseObject(i)))
})

app.post("/players/", async (request, response) => {
    let details = request.body;
    let {playerName,jerseyNumber,role} = details;
    let api2 = `INSERT INTO cricket_team(player_name,jersey_number,role )
    VALUES 
    (
        `${playerName}`,
        ${jerseyNumber},
        `${role}`
    )`
    let db3 = await database.run(api2)
    response.send("Player Added to Team")
})

app.get("/player"/ , async (request,response) => {
    let {playerId} = request.params
    let api3 = `
    SELECT * FROM cricket_team
    WHERE 
    player_id = ${playerId}`
    let db2 = await database.get(api3)
    response.send(convertDbObjectToResponseObject(db2))
})

app.put("/players/", async (request,response) => {
    let {playerId} = request.params
    let details = request.body
    let {playerName,jerseyNumber,role} = details
    let api4 = `
    UPDATE 
        cricket_team
    SET
        player_name=`${playerName}`,
        jersey_number = `${jerseyNumber}`,
        role=`${role}`
    WHERE 
        player_id = ${playerId}`
    await database.run(api4)
    response.send("Player Details Updated")
})

app.delete("/players/:playerId/", async (request,response) => {
    let {playerId} = request.params
    let deletePlayerQuery = `
        cricket_team
    WHERE 
        player_id = ${playerId};`;
        await database.run(deletePlayerQuery)
        response.send("Player Removed")
} )



module.exports = app;
