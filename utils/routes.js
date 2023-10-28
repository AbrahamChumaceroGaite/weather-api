const device = require('../routes/device/device');
const deviceclient = require('../routes/deviceclient/deviceclient');
const department = require('../routes/department/department');
const province = require('../routes/province/province');
const municipality = require('../routes/municipality/municipality');
const community = require('../routes/community/community');
const locations = require('../routes/location/location');
const client = require('../routes/client/client');
const rol = require('../routes/rol/rol');
const user = require('../routes/user/users');
const login = require('../routes/login/login');

module.exports = {
    device,
    deviceclient,
    department,
    province,
    municipality,
    community,
    locations,
    client,
    rol,
    user,
    login
};
