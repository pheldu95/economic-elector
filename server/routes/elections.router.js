const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/all', (req, res) => {
    pool.query('SELECT * FROM "elections" ORDER BY date ASC;').then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error in /all GET', error)
        res.sendStatus(500);
    })
});


router.get('/:election_id', (req, res) => {    
    const queryText = `SELECT * FROM elections WHERE id = ${req.params.election_id};`
    pool.query(queryText)
        .then((result) => res.send(result.rows))
        .catch((err) => {
            console.log('Error completing GET query', err);
            res.sendStatus(500);
        });
});

router.post('/newElection', (req, res) => {
    console.log(req.body);
    let id = 0;
    //this query returns all the info that we just created in the db. the whole row
    const queryText = 'INSERT INTO "elections" (name, date, location) VALUES($1, $2, $3) RETURNING *'
    pool.query(queryText, [req.body.office, req.body.date, req.body.location])
        .then(result => {
            res.send(result);
            //use the id we got back from the first query text to insert all the budget categories
            id = result.rows[0].id;
            const queryTextTwo = `INSERT INTO "budget_categories" ("name", "past_allocation", "election_id") VALUES
                ('Parks and Rec', $1, ${id}),
                ('Law Enforcement', $2, ${id}),
                ('Education', $3, ${id}),
                ('First Responders', $4, ${id}),
                ('Public Works', $5, ${id}),
                ('Administration', $6, ${id}),
                ('Community Development', $7, ${id})`;
            pool.query(queryTextTwo, [req.body.parksRec, req.body.lawEnforcement, req.body.education, req.body.firstResponders,
            req.body.publicWorks, req.body.administration, req.body.communityDev])
        })
        .catch((err) => {
            console.log('Error completing INSERT query', err);
            res.sendStatus(500);
        });
    });

//get an elections budget
router.get('/budget/:id', (req, res) => {
    const queryText = `SELECT * FROM "budget_categories" WHERE "election_id" = $1 ORDER BY id ASC;`
    pool.query(queryText, [req.params.id])
    //send to the client side
    .then((result) => res.send(result.rows))
    .catch((err) => {
        console.log('Error completing GET query', err);
        res.sendStatus(500);
      });
});

//delete an election. need to delete all candidates b efore you do this delete. we can change that later by adding more 
//awaits to the transaction
router.delete('/deleteElection/:id', (req, res) => {

    console.log('in deleteElection, req.params.id', req.params.id);

    ; (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            //delete all the stuff from budget categories
            let queryText = 'DELETE FROM "budget_categories" WHERE election_id=$1';
            await client.query(queryText, [req.params.id]);
            //delete the election from the elections table
            queryText = 'DELETE FROM "elections" WHERE id=$1';
            await client.query(queryText, [req.params.id]);
            await client.query('COMMIT')
        } catch (error) {
            //if it errors out, the db will rollback and restore the deleted data
            await client.query('ROLLBACK')
            throw error
        } finally {
            res.sendStatus(200)
            //must release the client at the end
            //or else the client will remain unavailable if you
            //want to use it again
            client.release()
        }
    })().catch(e => console.error(e.stack))
});

router.put('/editElection/:id', (req, res) =>{
    console.log(req.body, req.params.id);
    
    ; (async () => {
        const client = await pool.connect()
        try {
            //using transactions to update both tables in one go
            await client.query('BEGIN')
            let queryText = `UPDATE elections SET (name, location, date) = ($1, $2, $3) WHERE id = ${req.params.id}`;
            await client.query(queryText, [req.body.name, req.body.location, req.body.date]);
            let budgetArray = req.body.budgetArray;
            //loops through the budgetArray and updates the budget_categories table with the new values
            for(let i = 0; i < budgetArray.length; i++){
                queryText = `UPDATE budget_categories SET past_allocation = $1 WHERE id = ${budgetArray[i].id}`
                await client.query(queryText, [budgetArray[i].past_allocation]);
            }
            await client.query('COMMIT')
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            res.sendStatus(200)
            //must release the client at the end
            //or else the client will remain unavailable if you
            //want to use it again
            client.release()
        }
    })().catch(e => console.error(e.stack))
});
module.exports = router;