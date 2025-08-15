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
const PROFILE_DIR = process.env.PROFILE_DIR;
const PROFILES = getProfiles();

function getProfiles() {
    const files = fs.readdirSync(PROFILE_DIR).filter(f => f.endsWith('.profile-meta.xml'));

    return files.map(file => {
        const filePath = path.join(PROFILE_DIR, file);
        const xml = fs.readFileSync(filePath, 'utf-8');
        const json = parser.parse(xml);

        const name = path.basename(file);
        const fieldPermissions = json.Profile?.fieldPermissions || [];

        return {
            name,
            fields: Array.isArray(fieldPermissions) ? fieldPermissions : [fieldPermissions],
        };
    })
}

function getFieldName(fp) {
  if (typeof fp.field === 'string') {
    return fp.field.trim();
  }
  if (fp.field && typeof fp.field['#text'] === 'string') {
    return fp.field['#text'].trim();
  }
  return undefined;
}

function writeProfiles(field, object) {
    PROFILES.forEach(profile => {
        const fileName = profile.name;
        const filePath = path.join(PROFILE_DIR, fileName);
        const builder = new XMLBuilder(options);
        let changed = false;
        console.log(fileName);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Profile "${fileName}" was not found at "${filePath}"`);
        }
        
        const xml = fs.readFileSync(filePath, 'utf-8');
        const json = parser.parse(xml);
        
        if (!json.Profile.fieldPermissions) {
            json.Profile.fieldPermissions = [];
        } else if (!Array.isArray(json.Profile.fieldPermissions)) {
            json.Profile.fieldPermissions = [json.Profile.fieldPermissions];
        }
        
        const fieldPermissions = json.Profile.fieldPermissions;
        const newFieldPermission = {
            editable: false,
            field: `${object}.${field}`.replace(".field-meta.xml", "").trim(),
            readable: false,
        };

        const exists = fieldPermissions.some(fp => {
            const existingField = getFieldName(fp);
            return existingField === newFieldPermission.field;
        });

        if (!exists) {
            fieldPermissions.push(newFieldPermission);
            changed = true;
        }
        if (changed) {
            fieldPermissions.sort((a,b) => {
                const fa = a.field;
                const fb = b.field
                return fa < fb ? -1 : fa > fb ? 1 : 0;
            })
            const updatedXml = builder.build(json);
            fs.writeFileSync(filePath, updatedXml, 'utf-8');
        }
    });
}

module.exports = { writeProfiles };