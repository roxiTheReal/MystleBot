### Windows

1. go to [vscode's website](https://code.visualstudio.com) and click the download button
2. click the file you downloaded and follow the installation steps

### Ubuntu/Debian

1. go to [vscode's website](https://code.visualstudio.com) and click the download button that says "Download for Linux (.deb)"
2. click the file you downloaded and click "Install"

### Arch Linux

1. open a terminal (with Ctrl+Alt+T) and execute this command:
```bash
sudo nano /etc/pacman.conf
```
if that gives you an error that says `command not found`, just do `sudo pacman -S nano` and try again \

2. press Ctrl+F and type "multilib" (without the quotation marks), you should find something like:
```
# [multilib]
# Include = /etc/pacman.d/mirrorlist
```
delete both `#` symbols then do Ctrl+S and Ctrl+X

3. execute these commands:
```bash
sudo pacman -Sy
sudo pacman -S code
```

### Fedora

1. go to [vscode's website](https://code.visualstudio.com) and click the download button that says "Download for Linux (.rpm)"
2. click the file you downloaded and then click "Install"