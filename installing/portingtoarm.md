# On ARM PCs
## Introduction
This page is about porting NurOS to your ARM (AArch64) device.
### Devices
The most known ARM devices are Android smartphone, Raspberry Pi, etc.
#### Android
Android is not just the operating system and framework, it's the architecture of your device. To boot custom kernel and initial RAM file system you must make GKI - the Android kernel (boot.img). The flashing (installing) NurOS to your device is also depends on Android version, because the partitions of your device's memory are depends on Android version (shipped by vendor's firmware!), *for example, if you have the 13 or later, you will have the `boot` partition 
as the kernel and `init_boot` as initial RAM filesystem* [[Android Documentation, Architecture, Partitions](https://source.android.com/docs/core/architecture/partitions)]