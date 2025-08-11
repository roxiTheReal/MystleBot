# MystleBot

a great purpose discord bot, remade from scratch

## requirements

- node.js
- a terminal
- an ide (vscode will do)

## preparing

- [**how to install nodejs**](docs/nodejs.md)
- [**how to install vscode**](docs/vscode.md)

## how to use

1. clone this repository and chdir into it:
```bash
git clone https://github.com/roxiTheReal/MystleBot.git
cd MystleBot
```

2. install the npm dependencies:
```
npm i
```
3. open vscode and enter the repository, then create a new file called `.env` and inside it, write:
```dotenv
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_app_id
GUILD_ID=your_server_id
```
replace `your_bot_token` with your actual bot token, `your_app_id` with your actual application id and `your_server_id` with your actual server id, more on how to get these in the next steps

4. go to [discord's developer portal](https://discord.com/developers) and click "Get Started", then login to your discord account if needed
5. click the "New Application" button and type a name in the popup that appears, then click the checkbox and the "Create" button
6. in the bot's page, click "Bot" (left side of the screen) and click "Reset Token". confirm the action and verify it's you if prompted, then click "Copy"

> [!IMPORTANT]  
> paste this in the .env file you created replacing `your_bot_token`

7. go back to "General Information" and copy your application id

> [!IMPORTANT]  
> paste this in the .env file you created replacing `your_app_id`

8. go to "OAuth2" and in "OAuth URL Generator", click the "bot" and "application.commands" checkboxes
9. scroll down in the same page, and click the checkboxes:
    - View Channels
    - Send Messages
    - Manage Messages
    - Read Message History
    - Embed Links
    - Attach Files
    - Manage Channels
    - Manage Roles
    - Kick Members
    - Ban Members
    - Add Reactions
    - Mention Everyone
10. copy the generated link, making sure the dropdown above is set to "Guild Install", and paste it in a new tab
11. select the server you want to invite the bot to, then click "Continue" and then "Authorize"
12. go to discord, enter the settings, scroll down to "Advanced" and toggle "Developer Mode" on
13. go to the server your just invited the bot to, click the name and then "Copy Server ID"

> [!IMPORTANT]  
> paste this in the .env file you created replacing `your_server_id`

14. now for the fun part: in vscode, open the terminal (with Ctrl+\`) and type `node index.js`