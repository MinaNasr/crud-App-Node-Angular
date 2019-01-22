const router = require('express').Router();
const productModel = require('../../models/product');
const ObjectId = require('mongoose').Types.ObjectId;

const bodyParser = require('body-parser');
const urlEncodedMid = bodyParser.urlencoded();

const multer = require('multer');
const path = require('path');
// const multerMid = multer({
//     dest:'../public/images'
// });

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/images'))
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname + '-' + Date.now())
    }
});
var upload = multer({storage: storage});


router.post('/products/create',upload.single('image'),(req, res) => {
    if (req.body) {
        let productToBeAdded = new productModel({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            image:req.file.filename,
            regularPrice: req.body.regularPrice,
            salePrice: req.body.salePrice?req.body.salePrice:'',
            dateOnSaleFrom: req.body.dateOnSaleFrom?req.body.dateOnSaleFrom:'',
            dateOnSaleTo: req.body.dateOnSaleTo?req.body.dateOnSaleTo:'',
            stockQuantity: req.body.stockQuantity,
            manageStock: req.body.manageStock,
            sku: req.body.sku?req.body.sku:''
        })
        productModel.findOne({ name: req.body.name }, (err, doc) => {
            if (!err) {
                if (!doc) {
                    productToBeAdded.save((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                product: doc,
                                productCreated: true
                            })
                        } else {
                            res.json({
                                productCreated: false,
                                message: "error in saving the product"
                            })
                        }
                    })
                } else {
                    res.json({
                        productCreated: false,
                        message: "product with the same name already exists",
                        product:doc
                    })
                }
            }
        })
    }
})

router.get('/products', (req, res) => {
   
        productModel.find({}, (err, docs) => {
            if (!err) {
                res.status(200).json({
                    products: docs,
                    productsListed: true
                })
            } else {
                res.json({
                    productsListed: false
                })
            }
        })
    
})

router.post('/product',(req,res)=>{
    if(req.body.id){ 
        productModel.findOne({"_id":req.body.id},(err,doc)=>{
            if(!err){
                res.status(200).json({
                    product:doc,
                    productListed:true
                })
            }else{
                res.json({
                    productListed:false
                })
            }
        })
    }else{
        res.json({
            productListed:false,
            message:"not found"
        })
    }
   
})
router.post('/products/edit',upload.single('image'), (req, res) => {
    if (req.body.id) {
        productModel.findOne({ "_id": req.body.id }, (err, doc) => {
            if (!err) {
                if (doc) {
                    doc['name'] = req.body.name!=null ? req.body.name : doc['name'];
                    doc['slug'] = req.body.slug!=null ? req.body.slug : doc['slug'];
                    doc['image'] = req.file?  req.file.filename : doc['image'];
                    doc['description'] = req.body.description!=null ? req.body.description : doc['description'];
                    doc['regularPrice'] = req.body.regularPrice!=null ? req.body.regularPrice : doc['regularPrice'];
                    doc['salePrice'] = req.body.salePrice!=null ? req.body.salePrice  :doc['salePrice'];
                    doc['dateOnSaleFrom'] = req.body.dateOnSaleFrom?req.body.dateOnSaleFrom:null;
                    doc['dateOnSaleTo'] = req.body.dateOnSaleTo?req.body.dateOnSaleTo:null;
                    doc['stockQuantity'] = req.body.stockQuantity!=null ? req.body.stockQuantity : doc['stockQuantity'];
                    doc['manageStock'] = req.body.manageStock!=null ? req.body.manageStock : doc['manageStock'];
                    doc['sku'] = req.body.sku!=null ? req.body.sku : doc['sku']
                }
                productModel.update({ "_id": req.body.id },{$set:doc},(err,result)=>{
                    if(!err){
                        res.status(200).json({
                            product: doc,
                            productUpdated: true
                        })
                    }else{
                        res.json({
                            productUpdated: false,
                            err
                        })
                    }
                })
               
            }
        })
    } else {
        res.json({
            productUpdated: false,
            message: "you must specify the product you want to update"
        })
    }
})



router.post('/products/delete', (req, res) => {
    if (req.body.id) {
        productModel.findOne({ "_id": req.body.id }, (err, doc) => {
            if (!err) {
                if(doc){
                    doc.remove((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                productDeleted: true,
                                product: doc
                            })
                        } else {
                            res.json({
                                productDeleted: false,
                                message: "can't delete that product"
                            })
                        }
                    })
                }else{
                    res.json({
                        productDeleted: false,
                        message: "can't delete that product"
                    })
                }
               
            }
        })
    } else {
        res.json({
            productDeleted: false,
            message: "you must specify the product you want to delete"
        })
    }
})

module.exports = router;