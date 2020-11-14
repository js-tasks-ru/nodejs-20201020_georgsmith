const Product = require("../models/Product");

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  let products;

  if (query) {
    products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    ctx.body = { products };
  } else {
    products = await Product.find();
  }

  ctx.body = { products };
};
