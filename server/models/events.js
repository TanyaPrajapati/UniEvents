const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const eventSchema=new Schema({
    
  title: { 
    type: String, 
 required: true,},
  description: String,
  category: String,
  date: Date,
  location: String,
  deadline: Date,
  price: Number,
  image: { type: String ,
    default:"https://unsplash.com/photos/group-of-people-celebrating-occassion-tIr-PWgSYB4",
    set:(v)=>v==="" ? "https://unsplash.com/photos/group-of-people-celebrating-occassion-tIr-PWgSYB4":v,
  },
 attendees: {
  type: Number,
  default: 0,
},
 maxAttendees: {   // 👈 YE ADD KARO
    type: Number,
    required: true
  },
  registrations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
  ],

});


const Event=mongoose.model('Event',eventSchema);

module.exports=Event;