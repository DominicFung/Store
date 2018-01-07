export interface Administrator {
    username: string
    userID: string
}

export interface StoreData {
    items: {
        _id: string
        itemName: String
        inventory: number
        price: number
        description: String
        imgs: String[]
    }[]
}

export interface Cart {
    Cart: {}
}