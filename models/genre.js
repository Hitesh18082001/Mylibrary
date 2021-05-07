var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var GenreSchema=new Schema(
{

    name: {type: String,maxlength:100,minlength:3, required: true}

})
GenreSchema
.virtual('url')
.get(function(){
return '/catalog/genre/'+this._id;
});
module.exports=mongoose.model('Genre',GenreSchema);