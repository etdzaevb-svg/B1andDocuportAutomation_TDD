import { appInfo } from "../utilities/beta-data-reader";
import { BasePage } from "./BasePage";
import { HomePage } from './HomePage';
import { expect } from "@playwright/test"; 

export class LoginPage extends BasePage {
    // ! You can declare here as well without let / const / var. They are fields of the class. 
    // ! This way declarion is needed especially when you want to make the fields PRIVATE to class
    //page;
    //usernameInputBox;
    //passwordInputBox;
    //loginButton;

    // ! Sicne we are extending BasePage, we do not need the construtor to initialize the Elements, we can call locator() method in BasePage 
    // ! Since there INHERITANCE and no constructor in Child, it will use PARENT class constructor
    /*
    constructor (page) {
        this.page = page; 

         // LOCATORS
         // ! Thse are properties of the objects. Not decalred as var or let. 
         // ! That is why they are reachabel outside of the constructor in the methods below
        this.usernameInputBox = this.page.locator("//label[text()='Username or email']");
        this.passwordInputBox = this.page.locator("//label[text()='Password']");
        this.loginButton = this.page.locator("//button[@type='submit']");

        // TODO: HOMEWORK - > Locate all the other elements in LoginPage
    }
    */
    // class fields
    usernameInputBox = this.locator("//label[text()='Username or email']");
    passwordInputBox = this.locator("//label[text()='Password']");
    loginButton = this.locator("//button[@type='submit']");



    // REUSABLE METHODS
    async enterUsername (username) {
        await this.usernameInputBox.fill(username); 
    }

    async enterPassword (password) {
        await this.passwordInputBox.fill(password); 
    }

    async clickLoginButton () {
        await this.loginButton.click(); 
    }


    async login (username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password); 
        await this.clickLoginButton(); 
        if (username.includes("client")){
            const homePage = new HomePage(this.page); 
            await homePage.clickContinueButton(); 
        }
    }

    async navigateToLoginPage() {
        await this.page.goto(`${process.env.DOCUPORT_BASE_URL}/login`);
    }

    async loginAs (role) {

        // First we need to check if the GIVEN ROLE is a valid role 
        const {username, password} = this.getCredentialsFor(role);
        // Advisor - advisor - ADviSor
        //const ROLE = role.toUpperCase(); // ASVISOR
        //const usernameKEY = `DOCUPORT_${ROLE}_USERNAME`;
        //const passwordKEY = `DOCUPORT_${ROLE}_PASSWORD`;
        await this.login (username, password); 
    }

    getCredentialsFor (role) {
        // if given role is not among the avalable roles in test data file
        if (!appInfo.roles.includes(role.toLowerCase())) {
            throw new Error(`Unknown role "${role}" - use one of: ${appInfo.roles.join(", ")}`);
        }
        const ROLE = role.toUpperCase(); // ASVISOR
        const usernameKEY = `DOCUPORT_${ROLE}_USERNAME`;
        const passwordKEY = `DOCUPORT_${ROLE}_PASSWORD`;
        const username = process.env[usernameKEY];
        const password = process.env[passwordKEY];
        // if either or both dont exist in env, give error 
        if(!username || !password) {
            throw new Error(`No login for "${role}" - add ${usernameKEY} and/or ${passwordKEY}`);
        }
        return {username, password}
    }

    async verifyLoginPageIsOpen () {
        await expect (this.usernameInputBox).toBeVisible();
    }


}