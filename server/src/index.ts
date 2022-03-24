import express from 'express'
import bodyParser from 'body-parser'

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function deleteNathan(req: any, res: any) {
    console.log(req.body);
    return res.send("learning REST");
} 

app.delete('/nathan/:a&:b', deleteNathan);

app.listen(4000, () => {
console.log('server running on port 4000');
});   
