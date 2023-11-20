const access = require('../routes/access/access');
const device = require('../routes/device/device');
const deviceclient = require('../routes/deviceClient/deviceclient');
const department = require('../routes/department/department');
const province = require('../routes/province/province');
const municipality = require('../routes/municipality/municipality');
const community = require('../routes/community/community');
const notification = require('../routes/notifications/notifications')
const locations = require('../routes/location/location');
const client = require('../routes/client/client');
const person = require('../routes/person/person');
const product = require('../routes/product/product');
const category = require('../routes/category/category');
const structure = require('../routes/structure/structure');
const rol = require('../routes/rol/rol');
const user = require('../routes/user/users');
const login = require('../routes/login/login');

module.exports = {
    access,
    category,
    device,
    deviceclient,
    department,
    province,
    municipality,
    notification,
    community,
    locations,
    client,
    person,
    product,
    rol,
    user,
    login,
    structure
};
