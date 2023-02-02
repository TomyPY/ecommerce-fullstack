import { model, Schema } from 'mongoose'

const productSchema = new Schema(
    {
        _id: Number,
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        stock: { type: Number, required: true},
        thumbnail: { 
            type: String, 
            required: false, 
            default: 'https://icon-library.com/images/icon-picture/icon-picture-5.jpg' 
        }
    },
    {
        timestamps: true
    }
)

export default model("Product", productSchema)