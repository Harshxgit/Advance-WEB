"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubManager = void 0;
const redis_1 = require("redis");
class PubSubManager {
    //constructor, this will called automatically called when instance create
    constructor() {
        //create a redis client and connect to server
        this.redisClient = (0, redis_1.createClient)();
        this.redisClient.connect();
        this.subscription = new Map();
    }
    //sigleton noOne can crate instance instead of this
    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }
    userSubscribe(userid, stock) {
        var _a, _b;
        if (!this.subscription.has(stock)) {
            this.subscription.set(stock, []);
        }
        (_a = this.subscription.get(stock)) === null || _a === void 0 ? void 0 : _a.push(userid);
        if (((_b = this.subscription.get(stock)) === null || _b === void 0 ? void 0 : _b.length) == 1) {
            this.redisClient.subscribe(stock, (message) => {
                this.handleMessage(stock, message);
            });
            console.log(`Subscribed to Redis channel :${stock}`);
        }
    }
    userUnSubscribe(userid, stock) {
        var _a, _b;
        this.subscription.set(stock, ((_a = this.subscription.get(stock)) === null || _a === void 0 ? void 0 : _a.filter((subs) => subs !== userid)) || []);
        if (((_b = this.subscription.get(stock)) === null || _b === void 0 ? void 0 : _b.length) == 0) {
            this.redisClient.unsubscribe(stock);
            console.log(`Unsubscribe to redis channel ${stock}`);
        }
    }
    //define the method that will be called when a message published to the subscribed channel
    handleMessage(stock, message) {
        var _a;
        console.log(`Message recieved on Channel ${stock}:${message}`);
        (_a = this.subscription.get(stock)) === null || _a === void 0 ? void 0 : _a.forEach((subs) => {
            console.log(`Sending message to user ${subs}`);
        });
    }
    //cleanup on instance destruction
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisClient.quit();
        });
    }
}
exports.PubSubManager = PubSubManager;
