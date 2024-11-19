import { User } from "./UserModel";
import { Wishlist } from "./WishListModel";
import { Cart } from "./CartModel";
import { Rating } from "./RatingModel";
import { WishlistProduct } from "./WishListProductModel";
import { CartItem } from "./CartItemModel";
import { Product } from "./ProductModel";
import { Category } from "./CategoryModel";
import { Merchant } from "./MerchantModel";
import { Color } from "./ColorModel";
import { ProductColor } from "./ProductColorModel";
import { ProductCategory } from "./ProductCategoryModel";

import colors from "colors";

/**
 * Sets up associations between models
 **/
export const setupAssociations = () => {
  /**
   * Many-to-many relationship between products and categories.
   * Each product can have many categories, and each category can have many products.
   */
  Product.belongsToMany(Category, {
    through: ProductCategory,
    foreignKey: "product_id",
    otherKey: "category_id",
  });

  Category.belongsToMany(Product, {
    through: ProductCategory,
    foreignKey: "category_id",
    otherKey: "product_id",
  });

  /**
   * One-to-many relationship between products and merchants.
   * Each product belongs to one merchant, but a merchant can have many products.
   */
  Merchant.hasMany(Product, {
    foreignKey: "merchant_id",
    onDelete: "CASCADE",
  });

  Product.belongsTo(Merchant, {
    foreignKey: "merchant_id",
  });

  /**
   * Many-to-many relationship between products and colors.
   * Each product can have many colors, and each color can have many products.
   */
  Product.belongsToMany(Color, {
    through: ProductColor,
    foreignKey: "product_id",
    otherKey: "color_id",
  });

  Color.belongsToMany(Product, {
    through: ProductColor,
    foreignKey: "color_id",
    otherKey: "product_id",
  });

  /**
   * One-to-one relationship between users and wishlists.
   * Each user can have one wishlist, and each wishlist belongs to one user.
   */
  User.hasOne(Wishlist, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Wishlist.belongsTo(User, {
    foreignKey: "user_id",
  });

  /**
   * One-to-one relationship between users and carts.
   * Each user can have one cart, and each cart belongs to one user.
   */
  User.hasOne(Cart, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Cart.belongsTo(User, {
    foreignKey: "user_id",
  });

  /**
   * One-to-many relationship between users and ratings.
   * Each user can have many ratings, but a rating can only belong to one user.
   */
  User.hasMany(Rating, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Rating.belongsTo(User, {
    foreignKey: "user_id",
  });

  /**
   * One-to-many relationship between products and ratings.
   * Each product can have many ratings, but a rating can only belong to one product.
   */
  Product.hasMany(Rating, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
  });

  Rating.belongsTo(Product, {
    foreignKey: "product_id",
  });

  /**
   * Many-to-many relationship between carts and products.
   * Each cart can have many products, and each product can be in many carts.
   */
  Cart.belongsToMany(Product, {
    through: CartItem,
    foreignKey: "cart_id",
    otherKey: "product_id",
  });

  Product.belongsToMany(Cart, {
    through: CartItem,
    foreignKey: "product_id",
    otherKey: "cart_id",
  });

  /**
   * Many-to-many relationship between wishlists and products.
   * Each wishlist can have many products, and each product can be in many wishlists.
   */
  Wishlist.belongsToMany(Product, {
    through: WishlistProduct,
    foreignKey: "wishlist_id",
    otherKey: "product_id",
  });

  Product.belongsToMany(Wishlist, {
    through: WishlistProduct,
    foreignKey: "product_id",
    otherKey: "wishlist_id",
  });

  //success message
  console.log(colors.green("Models associations created successfully."));
};
