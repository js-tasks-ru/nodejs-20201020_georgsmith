const moongose = require("mongoose");
const Product = require("../models/Product");

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if(!ctx.query.subcategory) return next();

  const isValid = moongose.Types.ObjectId.isValid(ctx.query.subcategory);
  if(!isValid) ctx.throw(400, "invalid id");

  const products = await Product.find({ subcategory: ctx.query.subcategory });

  ctx.body = { products };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  const isValid = moongose.Types.ObjectId.isValid(ctx.params.id);
  if(!isValid) ctx.throw(400, "invalid id");

  const product = await Product.findById(ctx.params.id);
  if(!product) ctx.throw(404);

  ctx.body = { product };
};

