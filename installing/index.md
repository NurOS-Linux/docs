# Installing
## Introduction
This page is about installing NurOS to your physical or virtual device.
## For x86 PCs
The easiest devices to install NurOS are traditional x86 (Intel/AMD) computers. You can download latest bootable ISO image here. 
These computers have UEFI or BIOS that can boot our ISO disk image. But you must write image to portable device such as USB memory stick, CD drive, etc.  
**[ If you can't boot from your device, try to disable Secure Boot ]**  
### Making bootable device
To write ISO drive image you should use [Rufus](https://rufus.ie/) if you have Windows. Or if you have already other Linux/UNIX(-like) system, you should try 
to use `dd`, for example you can use the command below:  
```sh
dd if=NurOS.iso of=/dev/sdb bs=4096 status=progress
```