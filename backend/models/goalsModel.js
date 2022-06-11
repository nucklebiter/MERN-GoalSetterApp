const { default: mongoose } = require('mongoose')
const mogoose =  require('mongoose')

const goalSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text value']
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model('Goal', goalSchema)
