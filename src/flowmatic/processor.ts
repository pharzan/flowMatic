const cache = require('../utils/cache')
const deepSearch = require('../utils/deep-search')


interface ActionResponseObject {
    incoming: Incoming;
    actionParams: any;
    actionResponse: boolean;
}

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
    messageBody: IncomingBody
    used?: boolean;
}

class Bot {
    flow: Step[];

    constructor(flow: Step[]) {
        this.flow = flow;
    }

    run: any = async (step: Step, incoming: Incoming) => {
        const { userToken, messageBody, used } = incoming;

        let result: ActionResponseObject = {
            incoming,
            actionParams: step.actionParams,
            actionResponse: false, // status of action function
        }

        if(!step) throw Error('Step not provided');
        console.log(step)
        for (const aksyon of step.action) {
            result = await aksyon(step.actionParams, incoming)
            if (result.actionParams) step.actionParams = result.actionParams
        }

        await this.setUserStep(userToken, step.id, true)

        if (used) return
        if (result.actionResponse) {
            for (const target of step.next) {
                const nextstep = this.getNextStepById(this.flow, target.targetId)
                if (target.condition) {
                    if (target.condition === result.userInput.incoming.body) {
                        userInput.used = true
                        await this.setUserStep(from, target.targetId, false)
                        return await this.run(nextstep, userInput)
                    }
                } else {
                    await this.setUserStep(from, target.targetId, false)
                    return await this.run(nextstep, userInput)
                }

            }
        }


    }

    receiveMessage = async (incoming: Incoming) => {
        const { userToken } = incoming
        try {

            const userStepName = await this.getUserStepId(userToken)
            console.log(userStepName)
            if (userStepName) {
                const step = await this.findUserStepById(userStepName)
                if (step) return this.run(step, incoming)
            }


            this.run(this.flow[0], incoming)



        } catch (e) {
            console.log("CATCH::", e)
            throw new Error('There was an error receiving the message')
        }
    }

    findUserStepById = async (userStepId: string) => {
        const found = await deepSearch(this.flow, 'id', userStepId)
        if (found.length) {
            return found[0]
        }
    }

    setUserStep = (id: string, step: string, didExecute: boolean): void => {
        cache.set(id, JSON.stringify({ id: step, didExecute }))
    }

    getNextStepById = (steps: Step[], id: string): (Step | null) => {
        return steps.find(step => step?.id === id) || null
    }

    getUserStepId = async (userId: string): Promise<(string | null)> => {
        const result = await cache.get(userId)
        if (result) return JSON.parse(result).id
        return null
    }
}

export { Bot };