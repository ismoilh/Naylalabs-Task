const uuid = require('uuid');
const path = require('path');

class FileServices {
    saveFile(file) {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve('static', fileName);
        file.mv(filePath);
        return fileName;
    }
}
module.exports = new FileServices();
