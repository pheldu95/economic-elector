const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//get all candidates
router.get('/all/:election_id', (req, res) => {
    const query = `SELECT * FROM candidates WHERE election_id = ${req.params.election_id}`
    pool.query(query)
        .then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log("Error in candidate.router GET function", error);
            res.sendStatus(500);
        });
});
//get all budget allocations from each candidate
router.get('/allBudgets/:election_id', (req, res) => {
    const query = `SELECT DISTINCT budget_allocation.candidate_id, budget_allocation.budget_category_id, budget_allocation.amount 
    FROM budget_allocation 
    JOIN budget_categories ON budget_categories.election_id = ${req.params.election_id}
    ORDER BY budget_allocation.candidate_id ASC;`
    pool.query(query)
        .then((result) => {
            if (result.rows.length > 0) {
                let allocations = result.rows;
                let candidateId = allocations[0].candidate_id
                let candidateAllocations = {}; //this object will hold all the candidates with there 
                let candidateObject = {};
                let amount;
                for (let i = 0; i < allocations.length; i++) {
                    if (allocations[i].candidate_id === candidateId) {
                        amount = allocations[i].amount;
                        //add the amount into an object. the key for the amount is the budget category id
                        candidateObject = {
                            ...candidateObject,
                            [allocations[i].budget_category_id]: amount
                        }
                        //add the candidate object to candidateAllocations. the object's key is the candidate's id
                        candidateAllocations = {
                            ...candidateAllocations,
                            [allocations[i].candidate_id]: candidateObject
                        }

                    } else {
                        //add the last candidate and his allocations
                        candidateId = allocations[i].candidate_id;
                        amount = allocations[i].amount;
                        candidateObject = {
                            [allocations[i].budget_category_id]: amount
                        }
                    }

                }
                //send all the candidates and their allocations back.
                res.send(candidateAllocations);
            } else {
                res.sendStatus(200);
            }
        }).catch((error) => {
            console.log("Error in candidate.router GET allBudgets function", error);
            res.sendStatus(500);
        });
});
//get a specific candidate. so admin can edit it
router.get('/:candidate_id', (req, res) => {
    const query = `SELECT * FROM candidates WHERE id = ${req.params.candidate_id}`
    pool.query(query)
        .then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log("Error in candidate.router GET function", error);
            res.sendStatus(500);
        });
});

// post for admin to add a candidate 
router.post('/', (req, res) => {
    //the query returns the candidate_id, so it can be used to make the budget post at /budget
    const query = "INSERT INTO candidates (election_id, name, running_for, email, incumbent) VALUES ($1, $2, $3, $4, $5) RETURNING id"
    values = [req.body.election_id, req.body.name, req.body.running_for, req.body.email, req.body.incumbent]
    pool.query(query, values)
        .then((result) => {
            res.send(result);
        }).catch((error) => {
            console.log("Error in candidate.router POST function", error);
            res.sendStatus(500);
        })
});

//post for admin to add budget for candidate
router.post('/budget', (req, res) => {
    console.log('here is req.body', req.body);

    const query = "INSERT INTO budget_allocation (candidate_id, budget_category_id, amount) VALUES ($1, $2, $3)";
    values = [req.body.candidate_id, req.body.category_id, req.body.amount];
    pool.query(query, values)
        .then((result) => {
            res.sendStatus(200);
        }).catch((error) => {
            console.log("Error in cadidate.router for budget post", error);
            res.sendStatus(500);
        })
});

router.delete('/deleteCandidate/:id', (req, res) => {
    ; (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            let queryText = 'DELETE FROM "budget_allocation" WHERE candidate_id=$1';
            //delete all of the candidate's budget allocations
            await client.query(queryText, [req.params.id]);
            queryText = 'DELETE FROM "candidates" WHERE id=$1';
            //once budget allocations have been deleted, delete the candidate from the candidate table
            await client.query(queryText, [req.params.id]);
            await client.query('COMMIT')
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            res.sendStatus(200)
            //must release the client at the end
            //or else the client will remain unavailable if you
            //want to use it again?
            client.release()
        }
    })().catch(e => console.error(e.stack))
});

router.put('/editCandidate/:id', (req, res) => {    
    ; (async () => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            //update the candidates info in the candidate table
            let queryText = `UPDATE candidates SET (name, email, incumbent) = ($1, $2, $3) WHERE id = ${req.params.id};`;
            await client.query(queryText, [req.body.name, req.body.email, req.body.incumbent]);
            //update each of the candidates budget allocations
            for (const category in req.body.budget) {
                //inside the for in loop, we build a new object to send to the db
                //it holds the category name, the amount of money the candidate is allocating, and the candidate id
                categoryInfo = { category_id: category, amount: req.body.budget[category], candidate_id: req.params.id }
                queryText = `UPDATE budget_allocation SET amount = $1 WHERE budget_category_id = ${categoryInfo.category_id} AND candidate_id = ${req.params.id};`
                //send query to update the budget allocation to its new amount 
                await client.query(queryText, [categoryInfo.amount]);
            }
            await client.query('COMMIT')
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            res.sendStatus(200)
            client.release()
        }
        })().catch(e => console.error(e.stack))
})



module.exports = router;