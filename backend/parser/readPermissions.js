const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const {XMLParser} = require('fast-XML-parser');

const options = {
    ignoreAttributes : false,
    allowBooleanAttributes : true
};

const parser = new XMLParser(options);
const PERMISSION_SET_DIR = process.env.PERMISSION_SET_DIR;
const OBJECT_SET_DIR = process.env.OBJECT_SET_DIR;

function loadPermissionSets() {
    console.log(dotenv.PERMISSION_SET_DIR);
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

function loadObjects() {
    const folders = fs.readdirSync(OBJECT_SET_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  
    return folders;
  }

function loadPermissionSetByName(name) {
    const filename = `${name}.permissionset-meta.xml`;
    const filePath = path.join(PERMISSION_SET_DIR, filename);
  
    if (!fs.existsSync(filePath)) {
      throw new Error(`Permission set "${name}" not found.`);
    }
  
    const xml = fs.readFileSync(filePath, 'utf-8');
    const json = parser.parse(xml);
  
    const fieldPermissions = json.PermissionSet?.fieldPermissions || [];
  
    return {
      name,
      fields: Array.isArray(fieldPermissions) ? fieldPermissions : [fieldPermissions],
    };
}

function loadObjectByName(name) {
    const objectFolder = path.join(OBJECT_SET_DIR, name);
    const fieldsFolder = path.join(objectFolder, 'fields');
  
    if (!fs.existsSync(objectFolder)) {
      throw new Error(`Object folder "${name}" not found`);
    }
  
    if (!fs.existsSync(fieldsFolder)) {
      return [];
    }
  
    const fieldFiles = fs.readdirSync(fieldsFolder)
      .filter(f => f.endsWith('.field-meta.xml'));
  
    return fieldFiles;
  }

module.exports = { loadPermissionSets, loadPermissionSetByName, loadObjects, loadObjectByName };
