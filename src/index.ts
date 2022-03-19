import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Bot } from './flowmatic/processor'



const helloWorld = () => { }

const bot = new Bot([{
    id: 'Bot',
    interrupt: false,
    action: [helloWorld],
    actionParams: {},
    onFail: [helloWorld],
    next: []
}]);

const app: express.Application = express();
const port: number = 3001;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req: Request, res: Response) => {
    const { incoming, userToken } = req.body;
    const incomingMessage = {
        userToken,
        incoming
    }
    bot.receiveMessage(incomingMessage)

    return res.send({});
});

app.post('/main', (req: Request, res: Response) => {

    return res.send({});
});

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});