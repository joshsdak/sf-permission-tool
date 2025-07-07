const fs = require('fs');
const path = require('path');
const {XMLParser} = require('fast-XML-parser');

const options = {
    ignoreAttributes : false,
    allowBooleanAttributes : true
};

const parser = new XMLParser(options);
// C:\Users\jscheit\source\Workspaces\ITDev\Salesforce\Orgs\DEV\force-app\main\default\objects - FOR OBJECTS IF NEEDED
const PERMISSION_SET_DIR = 'C:/Users/jscheit/source/Workspaces/ITDev/Salesforce/Orgs/DEV/force-app/main/default/permissionsets';

function loadPermissionSets() {
    const files = fs.readdirSync(PERMISSION_SET_DIR).filter(f => f.endsWith('.permissionset-meta.xml'));

    return files.map(file => {
        const filePath = path.join(PERMISSION_SET_DIR, file);
        const xml = fs.readFileSync(filePath, 'utf-8');
        const json = parser.parse(xml);

        const name = path.basename(file, '.permissionset-meta.xml');
        const fieldPermissions = json.PermissionSet?.fieldPermissions || [];

        return {
            name,
            fields: Array.isArray(fieldPermissions) ? fieldPermissions : [fieldPermissions],
        };
    });
}

module.exports = { loadPermissionSets };
