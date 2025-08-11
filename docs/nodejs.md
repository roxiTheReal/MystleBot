### Windows

1. click [this](https://nodejs.org/dist/v24.5.0/node-v24.5.0-x64.msi) to download the node.js installer
2. open a command prompt as administrator, then execute these commands:
```bat
cd %USERPROFILE%\Downloads
msiexec.exe /i node-v24.5.0-x64.msi /quiet /norestart
```
the first command puts you in your downloads folder, the second one begins the installation of node.js silently

### Linux

1. open a terminal (with Ctrl+Alt+T)
2. execute these commands:
```bash
# For Ubuntu/Debian: sudo apt update && sudo apt install -y curl build-essential
# For Arch Linux: sudo pacman -Sy && sudo pacman -S --needed base-devel curl
# For Fedora: sudo dnf update && sudo dnf groupinstall "Development Tools" && sudo dnf install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
```

for both operating systems, confirm node is installed by executing:
```
node -v
npm -v
```

if both of them return a version number, all good to go

> [!NOTE]  
> for windows, you might need to open another cmd window or execute `refreshenv`