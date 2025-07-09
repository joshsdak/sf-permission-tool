const fs = require('fs');
const path = require('path');
const {XMLParser, XMLBuilder} = require('fast-XML-parser');

const options = {
    ignoreAttributes : false,
    allowBooleanAttributes : true,
    format: true,
    indentBy: "    ",
    suppressEmptyNode: false
}

const parser = new XMLParser(options);
const PERMISSION_SET_DIR = 'C:/Users/jscheit/source/Workspaces/ITDev/Salesforce/Orgs/DEV/force-app/main/default/permissionsets';
const OBJECT_SET_DIR = 'C:/Users/jscheit/source/Workspaces/ITDev/Salesforce/Orgs/DEV/force-app/main/default/objects';

function writePermissionSet(name, field, read, edit) {
    const fileName = `${name}.permissionset-meta.xml`;
    const filePath = path.join(PERMISSION_SET_DIR, fileName);
    const builder = new XMLBuilder(options);
  
    if (!fs.existsSync(filePath)) {
      throw new Error(`Permission set "${name}" not found at ${filePath}`);
    }
  
    const xml = fs.readFileSync(filePath, 'utf-8');
    const json = parser.parse(xml);
    const fieldPermissions = json.PermissionSet?.fieldPermissions;
  
    if (!Array.isArray(fieldPermissions)) {
      json.PermissionSet.fieldPermissions = [fieldPermissions];
    }
  
    const match = json.PermissionSet.fieldPermissions.find(fp => fp.field === field);
  
    if (!match) {
      return false;
    }
  
    match.readable = read;
    match.editable = edit;
  
    const updatedXml = builder.build(json);
    fs.writeFileSync(filePath, updatedXml, 'utf-8');
  
    return true;
  }

module.exports = { writePermissionSet }