const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Document = require('../models/document');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const DIR = 'api/uploads/';

const storage = multer.diskStorage({
    destination: DIR,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});

const fileExtensions = ['xls', 'xlsx'];
const maxFileSize = 1024 * 1024 * 10;

const upload = multer({
    fileFilter: (req, file, callback) => {
        let split = file.originalname.split('.');
        let ext = split[split.length - 1];

        if (fileExtensions.indexOf(ext) === -1) {
            return callback(new Error('Wrong extension'));
        } else if (file.size > maxFileSize) {
            return callback(new Error('Max file size exceeded'));
        }

        callback(null, true);
    },
    storage: storage
});

// Get uploaded files
router.get('/files/:username', (req, res, next) => {
    let username = req.params.username;
    Document.getAllDocumentsFromUser(username, (err, docs) => {
        if (err) throw err;
        if(!docs) {
            return res.json({success: false, msg: 'No documents found'});
        }
        res.send(docs);
    });
});

// Download file
router.post('/files/:originalname', function (req, res, next) {
    let originalname = req.params.originalname;
    let split = originalname.split('.');
    let ext = split[split.length - 1];

    Document.getDocumentByOriginalName(originalname, (err, document) => {
        if (err) throw err;
        if(!document) {
            return res.json({success: false, msg: 'No documents found'});
        }
        res.download(DIR + document.filename);
    });
});

// Upload file
router.post('/upload', upload.single('uploadFile'), (req, res, next) => {

    if(req.file) {
        let file = req.file;
        let owner = JSON.parse(req.body.owner);
        let split = file.originalname.split('.');
        let ext = split[split.length - 1];
        let sum = Document.getDocumentSum(req.file.path, ext);

        let newDocument = new Document({
            filename: file.filename,
            originalname: file.originalname,
            sum: sum,
            owner_username: owner.username,
        });

        Document.addDocument(newDocument, (err, file) => {
            if(err) {
                res.json({success: false, msg: 'Failed to add the document'});
            }
            else {
                res.json(file);
            }
        })
    }
});

// Delete file
router.delete('/files/:id', function (req, res, next) {
    let id = req.params.id;
    Document.getDocumentById(id, (err, document) => {
        if (err) throw err;
        Document.removeDocument(id, (err) => {
            if (err) {
                res.json({success: false, msg: 'Failed to delete the document'});
            }
            else {
                fs.unlink(DIR + document.filename);
                res.json({success: true, msg: 'Document deleted!'});
            }
        });
    });
});

module.exports = router;