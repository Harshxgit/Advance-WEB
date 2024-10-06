"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("./pubsub");
setInterval(() => {
    pubsub_1.PubSubManager.getInstance().userSubscribe(Math.random().toString(), "apple");
}, 5000);
