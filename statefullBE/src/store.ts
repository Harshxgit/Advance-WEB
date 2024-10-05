
interface Game{
    id :string;
    whitePlayerName:string;
    blackPlayerName:string;
    moves : string[]
}


//singleton
export class GameManager {
    games : Game[] =[];
    
    // attribute, same type
    public static instance : GameManager
    private constructor(){
        this.games = []
    }

    //check if instance are already exists or not
    static getInstance(){
        if(GameManager.instance){
            return GameManager
        }

        GameManager.instance = new GameManager()
        return  GameManager.instance
    }
    addMove(gameId:string,move:string){
        console.log(`adding move ${move} to game ${gameId}`)
        const game = this.games.find(game => game.id === gameId)
        game?.moves.push(move)
    }
    addGame(gameId:string){
        const game = {
            id : gameId,
            whitePlayerName:"Alice",
            blackPlayerName:'Denzel',
            moves:[]
        }
        this.games.push(game)
    }
    log(){
        console.log(this.games)
    }
}

// export const gameManager = GameManager.getInstance()
// this will be red , when you create a new instance
// export const gameManager = new GameManager()
