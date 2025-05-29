# Android SDK Environment Setup Script

# Default Android SDK location
$ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Check if Android Studio is installed in the default location
if (Test-Path "C:\Program Files\Android\Android Studio") {
    Write-Host "Android Studio found in default location"
} else {
    Write-Host "Please install Android Studio from https://developer.android.com/studio"
    exit 1
}

# Set environment variables
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $ANDROID_HOME, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $ANDROID_HOME, "User")

# Add platform-tools to PATH
$platformTools = "$ANDROID_HOME\platform-tools"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $currentPath.Contains($platformTools)) {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$platformTools", "User")
}

Write-Host "Environment variables have been set up."
Write-Host "Please restart your terminal and run 'adb devices' to verify the setup." 