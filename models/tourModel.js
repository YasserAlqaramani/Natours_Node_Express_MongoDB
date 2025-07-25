const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters '],
        minlength: [10, 'A tour name must have more or equal then 10 characters '],
        // validate: [validator.isAlpha, 'Tour name must only contain character']  its not include a spaces in word
    },
    slug: String,
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a group size'] },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: { // only for Strings
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult!'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) /10
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW DOCUMENT Creation
            return val < this.price
            },
        message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: { type: String, trim: true, required: [true, 'A tour must have a summary'] },
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, 'A tour must have a cover image'] },
    images: [String],
    createdAt: { type: Date, default: Date.now(), select: false }, // mean this field not return in query
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]

},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

// tourSchema.index({price: 1});// {price: -1}
// tourSchema.index({price: 1, ratingsAverage: -1});
// tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2dsphere'});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// to get all users data from guides array of ids of users (if guides: Array in Schema)
// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises);
//     next();
// })

// tourSchema.pre('save', function(next) {
//     console.log("Will Save Document!");
//     next();
// })
// Document Middleware: runs after .save() and .create()
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

//VIRTUAL POPULATE 
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    // this.start = Date.now();
    next();
});
tourSchema.pre(/^find/, function(next) {
    //we use populate to fill up guides field with all user data  ....for relationShip 
    this.populate({ path: 'guides', select: '-__v -passwordChangedAt'})
    next();
});
// tourSchema.post(/^find/, function(docs, next) {
//     console.log(`its Take ${(Date.now() - this.start)/1000} Seconds`);
//     console.log(docs)
//     next();
// })

// AGGREGATION MIDDLEWARE  we will fix that later!!
// tourSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//     console.log(this);
//     next();
// })
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;