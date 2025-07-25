const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAll = Model => catchAsync(async (req, res, next) => {

    // to Allow for nested Get reviews on Tour
    let filter = {}
    if(req.params.tourId) filter = { tour: req.params.tourId }
    console.log(req.query);
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            data: doc
        }
    })
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    
    const doc = await query;
    if(!doc) {
        return next(new AppError('No Document Found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});
exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc) {
        return next(new AppError('No Document Found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
        return next(new AppError('No Document Found with that ID', 404));
    }
    res.status(201).json({
        status: 'success'
    })
});