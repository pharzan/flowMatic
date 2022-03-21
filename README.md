# Flow Matic
### A package to automate youe user flows
#### A work in progree...
By using this package you can create a simple user flow with just creating a config file.
The concept is to have a single endpoint to manage the whole user flow and to have functions to execute at every step of the flow. The user step is stored in a Redis db, currently in a local debis like memory storage for development purposes and on each call before anything the step is retrieved from the db. on each call based on the conditions the action function of the certain user step is called and executed if the conditions are met and the result of the action step are met a status true is returned and on the next call the next step of the config is called.

### simple Hello World Example

```
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
```

```
onst helloWorld = (actionParams: any, userInput: any) => {
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
```

