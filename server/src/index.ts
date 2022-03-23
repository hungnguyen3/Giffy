import express from 'express'

const app = express()

app.delete('/nathan', (req, res) => {
    return res.send("learning REST");
})

app.listen(4000, () => {
console.log('server running on port 4000');
});   
