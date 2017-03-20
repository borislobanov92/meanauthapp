const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const xlsx = require('xlsx');

// Document Schema
const DocumentSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    sum: {
        type: Number,
        required: true
    },
    owner_username: {
        type: String,
        required: true
    }
});

const Document = module.exports = mongoose.model('Document', DocumentSchema);

module.exports.getDocumentById = function(id, callback) {
    Document.findById(id).exec(callback);
}

module.exports.getDocumentByFilename = function(filename, callback) {
    const query = {filename: filename};
    Document.findOne(query, callback);
}

module.exports.getDocumentByOriginalName = function(originalname, callback) {
    const query = {originalname: originalname};
    Document.findOne(query, callback);
}

module.exports.getAllDocumentsFromUser = function(owner_username, callback) {
    const query = {owner_username: owner_username};

    Document.find(query, callback);
}

module.exports.addDocument = function(newDocument, callback) {
    newDocument.save(callback);
}

module.exports.getDocumentSum = function(pathname, ext) {

    // Parse excel file and calculate sum
    let workbook = xlsx.readFile(pathname);
    let firstSheetName = workbook.SheetNames[0];

    let worksheet = workbook.Sheets[firstSheetName];
    let sum = 0;

    const getLetters = (cell) => {
        let symbols = cell.split('');
        let digits = symbols.filter(symbol => symbol != Number(symbol));
        let letters = digits.join('');

        return letters;
    }

    const getNumbers = (cell) => {
        let symbols = cell.split('');
        let digits = symbols.filter(symbol => symbol == Number(symbol));
        let numbers = digits.join('');

        return Number(numbers);
    }

    for (cell in worksheet) {
        if (getLetters(cell) == 'E' && getNumbers(cell) > 1){
            sum += Number(worksheet[cell]['v']);
        }
    }

    return sum;
}

module.exports.removeDocument = function(id, callback) {
    Document.findByIdAndRemove(id, callback);
}