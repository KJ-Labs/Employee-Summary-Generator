const fs = require('fs');
const inquirer = require('inquirer');

// Employee template based on these below.
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const Manager = require("./lib/manager");


// This array fills in with employee data.
const teamMembers = [];
let manager;
let teamTitle;



function managerData() {
    inquirer.prompt([
        {   // Fill html with teamName.
            type: "input",
            message: "What is the name of this team/project?",
            name: "teamTitle",
            default: "Team1"
        },
        {   // There is only 1 manager for a team.
            type: "input",
            message: "Who is the manager of this project?",
            name: "managerName",
            default: "manager1"
        },
        {   // Employee ID.
            type: "input",
            message: "What is the manager's ID?",
            name: "managerID",
            default: "1"
        },
        {   // Employee Email.
            type: "input",
            message: "What is the manager's email?",
            name: "managerEmail",
            default: "manager@gmail.com"
        },
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }]).then(managerAnswers => {
            manager = new Manager(managerAnswers.managerName, managerAnswers.managerID, managerAnswers.managerEmail, managerAnswers.officeNumber);
            teamTitle = managerAnswers.teamTitle;
            console.log("Now we will ask for employee information.")
            lesserEmployeeData();
        });
}

function lesserEmployeeData() {
    inquirer.prompt([
        {
            type: "list",
            message: "What is this employee's role?",
            name: "employeeRole",
            choices: ["Intern", "Engineer"],
            default: "manager@gmail.com"
        
        },

        {
            type: "input",
            message: "What is the employee's name?",
            name: "employeeName",
            default: "manager@gmail.com"
        },
        {
            type: "input",
            message: "What is the employee's id?",
            name: "employeeId",
            default: "manager@gmail.com"
        },
        {
            type: "input",
            message: "What is the employee's email?",
            name: "employeeEmail",
            default: "manager@gmail.com"
        },
        {
            type: "input",
            message: "What is the Engineer's Github?",
            name: "github",
            when: (userInput) => userInput.employeeRole === "Engineer",
            default: "manager@gmail.com"
        },
        {
            type: "input",
            message: "What's the Intern's school?",
            name: "school",
            when: (userInput) => userInput.employeeRole === "Intern",
            default: "manager@gmail.com"
        },
        {
            // if yes, go back again. If no, show the cards
            type: "confirm",
            name: "newEmployee",
            message: "Would you like to add another team member?" 
        }
    ]).then(answers => {

        if (answers.employeeRole === "Intern") {
            const employee = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school);
            teamMembers.push(employee);
        } else if (answers.employeeRole === "Engineer") {
            teamMembers.push(new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github));
        }
        if (answers.newEmployee === true) {
            lesserEmployeeData();
        } else {

            var main = fs.readFileSync('./templates/main.html', 'utf8');
            main = main.replace(/{{teamTitle}}/g, teamTitle);

            // Loop through the employees and print out all of their cards without replacing the previous one.
            var managerCard = fs.readFileSync('./templates/Manager.html', 'utf8');
            managerCard = managerCard.replace('{{name}}', manager.getName());
            managerCard = managerCard.replace('{{role}}', manager.getRole());
            managerCard = managerCard.replace('{{id}}', manager.getId());
            managerCard = managerCard.replace('{{email}}', manager.getEmail());
            managerCard = managerCard.replace('{{officeNumber}}', manager.getOfficeNumber());



            var cards = managerCard; // Initial cards only has the Manager card info.
            for (var i = 0; i < teamMembers.length; i++) {
                var employee = teamMembers[i];
                // Cards adds and then equals every new employee card info.
                cards += renderEmployee(employee);
            }

            // Adds cards to main.html and outputs to team.html.
            main = main.replace('{{cards}}', cards);

            fs.writeFileSync('./output/team.html', main);

            // Console.log that the html has been generated
            console.log("The team.html has been generated in output");
        }
    });
}

// renderEmployee function that is called above.

function renderEmployee(employee) {
    if (employee.getRole() === "Intern") {
        var internCard = fs.readFileSync('./templates/Intern.html', 'utf8');
        internCard = internCard.replace('{{name}}', employee.getName());
        internCard = internCard.replace('{{role}}', employee.getRole());
        internCard = internCard.replace('{{id}}', employee.getId());
        internCard = internCard.replace('{{email}}', employee.getEmail());
        internCard = internCard.replace('{{school}}', employee.getSchool());
        return internCard;
    } else if (employee.getRole() === "Engineer") {
        var engineerCard = fs.readFileSync('./templates/Engineer.html', 'utf8');
        engineerCard = engineerCard.replace('{{name}}', employee.getName());
        engineerCard = engineerCard.replace('{{role}}', employee.getRole());
        engineerCard = engineerCard.replace('{{id}}', employee.getId());
        engineerCard = engineerCard.replace('{{email}}', employee.getEmail());
        engineerCard = engineerCard.replace('{{github}}', employee.getGithub());
        return engineerCard;
    }
}

managerData();