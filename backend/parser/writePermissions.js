const dotenv = require('dotenv');
dotenv.config();
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
const PERMISSION_SET_DIR = process.env.PERMISSION_SET_DIR;

function writePermissionSet(permission, field, read, edit) {
    const fileName = `${permission}.permissionset-meta.xml`;
    const filePath = path.join(PERMISSION_SET_DIR, fileName);
    const builder = new XMLBuilder(options);
  
    if (!fs.existsSync(filePath)) {
      throw new Error(`Permission set "${permission}" not found at ${filePath}`);
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

function writeNewFieldPermission(permission, object, field) {
  const fileName = `${permission}.permissionset-meta.xml`;
  const filePath = path.join(PERMISSION_SET_DIR, fileName);
  const builder = new XMLBuilder(options);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Permission set "${permission}" not found at ${filePath}`);
  }
  
  const xml = fs.readFileSync(filePath, 'utf-8');
  const json = parser.parse(xml);

  if (!json.PermissionSet.fieldPermissions) {
    json.PermissionSet.fieldPermissions = [];
  } else if (!Array.isArray(json.PermissionSet.fieldPermissions)) {
    json.PermissionSet.fieldPermissions = [json.PermissionSet.fieldPermissions];
  }

  const fieldPermissions = json.PermissionSet.fieldPermissions;
  const newFieldPermission = {
    editable: false,
    field: `${object}.${field}`,
    readable: false,
  };

  const exists = fieldPermissions.some(fp => fp.field === newFieldPermission.field);
  if (exists) {
    throw new Error(`Field permission for "${newFieldPermission.field}" already exists in "${permission}"`);
  }

  fieldPermissions.push(newFieldPermission);
  fieldPermissions.sort((a, b) => a.field.localeCompare(b.field));
  json.PermissionSet.fieldPermissions = fieldPermissions;

  
  const updatedXml = builder.build(json);
  fs.writeFileSync(filePath, updatedXml, 'utf-8');

  return true;
}

module.exports = { writePermissionSet, writeNewFieldPermission }