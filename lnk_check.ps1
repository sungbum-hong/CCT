 = New-Object -ComObject WScript.Shell
 = [System.Environment]::GetFolderPath("Desktop")
 = Get-ChildItem  -Filter "*.lnk"
foreach ( in ) {
   = .CreateShortcut(.FullName)
  Write-Output (.Name + " | " + .TargetPath + " | " + .Arguments + " | " + .WorkingDirectory)
}