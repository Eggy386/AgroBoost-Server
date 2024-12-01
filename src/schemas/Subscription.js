const mongoose = require("mongoose"); 
const {Schema} = mongoose;

const SubscriptionSchema = new Schema(
    {
      id_usuario: { 
        type: Schema.Types.ObjectId, ref: "Usuarios", required: true
      },
      endpoint: { 
        type: String, required: true 
      },
      expirationTime: { 
        type: Date, default: null 
      },
      keys: {
        p256dh: { 
          type: String, required: true 
        },
        auth: { 
          type: String, required: true 
        },
      },
    },
    { collection: "Subscription" } 
  );
  
  module.exports = mongoose.model("Subscription", SubscriptionSchema);