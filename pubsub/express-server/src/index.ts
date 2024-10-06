import { createClient, RedisClientType } from "redis";

export class PubSubManager {
  //attributes
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscription: Map<string, string[]>;

  //constructor, this will called automatically called when instance create

  private constructor() {
    //create a redis client and connect to server
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscription = new Map();
  }

  //sigleton noOne can crate instance instead of this
  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  public userSubscribe(userid: string, stock: string) {
    if (!this.subscription.has(stock)) {
      this.subscription.set(stock, []);
    }
    this.subscription.get(stock)?.push(userid);
    if (this.subscription.get(stock)?.length == 1) {
      this.redisClient.subscribe(stock, (message) => {
        this.handleMessage(stock, message);
      });
      console.log(`Subscribed to Redis channel :${stock}`);
    }
  }
  public userUnSubscribe(userid: string, stock: string) {
    this.subscription.set(
      stock,
      this.subscription.get(stock)?.filter((subs) => subs !== userid) || []
    );
    if (this.subscription.get(stock)?.length == 0) {
      this.redisClient.unsubscribe(stock);
      console.log(`Unsubscribe to redis channel ${stock}`);
    }
  }

  //define the method that will be called when a message published to the subscribed channel
  private handleMessage(stock: string, message: string) {
    console.log(`Message recieved on Channel ${stock}:${message}`);
    this.subscription.get(stock)?.forEach((subs) => {
      console.log(`Sending message to user ${subs}`);
    });
  }

  //cleanup on instance destruction
  public async disconnect() {
    await this.redisClient.quit();
  }
}
