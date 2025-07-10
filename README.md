# sf-permission-tool
UI Tool to edit salesforce permission sets easier

How to Use
1. Download or Clone this Repository and open in VS Code
2. cd into frontend and run npm install
3. cd into backend and run npm install
4. in backend add .env file and add the following 2 variables
   * PERMISSION_SET_DIR = 'Path to your salesforce permission sets folder in desired org'
   * OBJECT_SET_DIR = 'Path to your salesforce objects folder in desired org'
6. cd back to root run npm install one last time
7. run npm start or npm run start and select to link in the terminal to open in browser
8. Once in the browser, select the desired permission/object and edit as needed
9. View and commit changes in VS after making changes in the browser
