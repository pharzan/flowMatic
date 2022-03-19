interface NextSteps { targetId: string, condition?: any }

interface Step {
    id: string;
    interrupt: boolean,
    action: { (...args: any[]): any }[];
    actionParams: object;
    onFail?: { (...args: any[]): void }[];
    next: NextSteps[];
}
interface IncomingBody {
    body: string;
};
interface Incoming {
    userToken: string;
    incoming: IncomingBody
    used?: boolean;
}

class Bot {
    userFlow: Step[];

    constructor(userFlow: Step[]) {
        this.userFlow = userFlow;
    }

    receiveMessage = async (message: Incoming) => {
        const { userToken } = message
        try {
            console.log(userToken)

        } catch (e) {
            console.log("CATCH::", e)
            throw new Error('There was an error receiving the message')
        }
    }
}

export { Bot };