import { model, Schema } from 'mongoose'

const cartSchema = new Schema(
    {
        _id: Number,
        products: Array
    },
    {
        timestamp: true
    }
)

export default model("Cart", cartSchema)