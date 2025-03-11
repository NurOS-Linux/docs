# On x86 PCs
## Introduction
This page is about installing NurOS to your physical or virtual x86-64 device.  
To install NurOS on traditional x86 computers, you must make bootable device, such as USB memory stick, CD or external SSD/HDD. To make bootable device you must write our ISO drive image to your memory device. The UEFI or BIOS on computer will boot the files from flashed memory device.  
**[ NurOS only supports 64-bit x86 architectures (x86-64) ]**  
**[ If you can't boot from your device, try to disable Secure Boot ]**
### Making bootable device
To write ISO drive image you should use [Rufus](https://rufus.ie/) if you have Windows. Or if you have already other Linux/UNIX(-like) system, you should try 
to use `dd`, for example you can use the command below:  
```sh
dd if=NurOS.iso of=/dev/sdb bs=4096 status=progress
```
### Booting
Then you must boot your bootable device using UEFI/BIOS of your PC, you can use boot menu feature or make your bootable device to first entry.  
And you will see the GRUB screen, you should select "Try and Install NurOS" and select mode to boot our Live CD.  
  
*Do you want to install on your ARM device? See the [On ARM PCs](./portingtoarm.md) page.*