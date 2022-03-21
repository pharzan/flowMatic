import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Bot } from './flowmatic/processor'



const helloWorld = (actionParams: any, userInput: any) => {
    console.log("Hello World!")
    return {
        userInput,
        actionResponse: true
    }
}
const helloWorld2 = (actionParams: any, userInput: any) => {
    console.log("Hello World 2!")

    return {
        userInput,
        actionResponse: true
    }
}

const bot = new Bot(
    [
        {
            id: 'Bot',
            interrupt: false,
            action: [helloWorld],
            actionParams: {},
            onFail: [helloWorld],
            next: [{
                targetId: 'GREETING',
            }]
        },
        {
            id: 'GREETING',
            interrupt: false,
            actionParams: { message: 'Hello and welcome to my bot!' },
            action: [helloWorld2],
            next: []
        },
    ]
);

const app: express.Application = express();
const port: number = 3001;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/main', (req: Request, res: Response) => {
    const { messageBody, userToken } = req.body;
    const incomingMessage = {
        userToken,
        messageBody
    }
    bot.receiveMessage(incomingMessage)

    return res.send({ response: true });
});


app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});