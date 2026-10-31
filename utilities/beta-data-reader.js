import { readFileSync } from "fs";

** Class representing the Docuport application test data */
lass AppInfo {
   /**
    * @param {Object} data
    * @param {string} data.appName
    * @param {string} data.baseUrl
    * @param {string} data.loginPageTitle
    * @param {string[]} data.roles
    * @param {Object<string, string[]>} data.leftMenu - menu per role
    */
   constructor({ appName, baseUrl, loginPageTitle, roles, leftMenu }) {
       this.appName = appName;
       this.baseUrl = baseUrl;
       this.loginPageTitle = loginPageTitle;
       this.roles = roles;
       this.leftMenu = leftMenu;
   }


** @type {AppInfo} */
export const appInfo = new AppInfo(
   JSON.parse(readFileSync("./data/beta_data.json", "utf8"))
;

*
   ! If you do not want to declare the class AppInfo, the following code will do all together
   ! With this alternative, you do not need to add new properties explicitly.
   ! With the class above, new properties need to be added to the constructor.

   import { readFileSync } from "fs";

   export const appInfo = JSON.parse(
       readFileSync("./data/beta_data.json", "utf8")
   );
/