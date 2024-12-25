import Product from "../models/productModel.js";
import ErrorHander from "../utils/errorhander.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";
import plants from "../models/collectionModel.js"
import cloudinary from "cloudinary";

//Create Product ---- Admin
export const createProduct = catchAsyncError(async (req, res, next) => {
  // console.log({image:req.body.images});
  
  // const imagesLink = [{ public_id: result.public_id, url: result.secure_url }];

  // req.body.images = imagesLink;
  // req.body.user = req.user.id;

  // const product = await Product.create(req.body);
  const plant = await plants.create(req.body);

  res.status(201).json({
    success: true,
    plant,
  });
});

//GetAll Products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const product = await apiFeatures.query;
  res.status(201).json({
    success: true,
    product,
    productCount,
    resultPerPage,
  });
});

//GetAll Products --> Admin
export const getAllProductsAdmin = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(201).json({
    success: true,
    products,
  });
});

//Update Product --- Admin
export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }

  //Updatiing images

  if (req.body.images !== undefined) {
    await cloudinary.v2.uploader.destroy(product.images[0].public_id);
    const result = await cloudinary.v2.uploader.upload(req.body.images, {
      folder: "Products",
    });
    const imagesLink = [
      { public_id: result.public_id, url: result.secure_url },
    ];
    req.body.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product --- Admin
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }

  //Deleting image from cloudinary
  await cloudinary.v2.uploader.destroy(product.images[0].public_id);

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    msg: "Product deleted successfully",
  });
});

//Get Single product detail
export const getProductDetail = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Create New Review or update the review
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Get all reviews of a single product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete review
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );

  // product.reviews.

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  // reviews.rating = avg / reviews.length;

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({
    success: true,
  });
});
