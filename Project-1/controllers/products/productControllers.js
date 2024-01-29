import { error } from "console";
import Product from "../../models/product";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../../services/CustomeErrorHandler";
import Joi from "joi";
import fs from "fs";
import productSchema from "../../validators/productSchema";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 100000 * 5 },
}).single("image"); //5mb

const productControllers = {
  async store(req, res, next) {
    // Multipart form data
    handleMultipartData(req, res, async (error) => {
      if (error) {
        // console.log("inside the store");
        return next(CustomErrorHandler.serverError(error.msg));
      }
      // console.log(req.file);
      const filePath = req.file.path;
      console.log(filePath);

      // validation of recevied data for products
      const { err } = productSchema.validate(req.body);
      if (err) {
        // validation failed .. So delete the image
        // console.log("asda");
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            // console.log("inside the store unlink");
            return next(CustomErrorHandler.serverError(err.message));
          }
          //   console.log("afa");
        });
        return next(err);
      }

      const { productName, price, size } = req.body;
      let document;
      try {
        document = await Product.create({
          productName,
          price,
          size,
          image: filePath,
        });
      } catch (error) {
        // console.log("adsaf");
        return next(error);
      }
      res.status(201).json(document);
    });
  },

  //    For product update

  update(req, res, next) {
    handleMultipartData(req, res, async (error) => {
      if (error) {
        console.log("inside the update");
        return next(CustomErrorHandler.serverError(error.msg));
      }
      //   console.log(req.file);
      let filePath;

      if (req.file) {
        filePath = req.file.path;
      }

      // validation of recevied data for products
      const { err } = productSchema.validate(req.body);
      if (err) {
        // validation failed .. So delete the image
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              console.log("inside the productControllers");
              return next(CustomErrorHandler.serverError(err.message));
            }
            //   console.log("afa");
          });
          return next(err);
        }
      }
      // console.log("asda");

      const { productName, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            productName,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
        console.log(`${document} ,${req.params.id},${productName}`);
        console.log(req.body);
      } catch (error) {
        // console.log("adsaf");
        return next(error);
      }

      res.status(201).json(document);
    });
    // res.status(200).json(document);
  },
  async delete(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    // image delete
    const imagePath = document._doc.image; // _doc gives orginal address without using getters in productSchema
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });

    res.json({ msg: "deletion  done!", document });
  },
  async getAllProducts(req, res, next) {
    let document;
    // pagination mongoose  pagination
    try {
      document = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 }); // last  added comes first
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    // console.log(document);
    res.json(document);
  },
  async getSingleProduct(req, res, next) {
    let document;
    // pagination mongoose  pagination
    try {
      document = await Product.findById(req.params.id).select(
        "-updatedAt -__v"
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    // console.log(req.body.id);
    res.json(document);
  },
};

export default productControllers;
