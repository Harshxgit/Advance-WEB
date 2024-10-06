import { PubSubManager } from "./pubsub";

setInterval(()=>{
    PubSubManager.getInstance().userSubscribe(Math.random().toString(),"apple");
},5000)
