import { createClient } from "redis";
const client = createClient()

async function processSubmission(submission:string){
    const {problemid,code,language} = JSON.parse(submission)
    console.log(`processing submission for problemid ${problemid}...`)
    console.log(`Code ${code}...`)
    console.log(`Language ${language}...`)

    //here i would add your actual processing logic
    //sumulate processing delay

    await new Promise(resolve=> setTimeout(resolve,1000))
    console.log(`Finished processing submission for problemid ${problemid}`)
}

async function startWorker(){
    try{
        await client.connect()
        console.log("worker connected to Redis")
       
        //Main loop
        while(true){
            try{
                const submission = await client.brPop("problems", 0);
                console.log("first")
                console.log("reach here")
                //@ts-ignore
                await processSubmission(submission.element)
            }catch(error){
                console.error("Failed to connect to Redis",error)
            }
        }
    }catch(error){
        console.error("Failed to connect to Redis",error)
    }
}
startWorker()