 = New-Object -ComObject WScript.Shell
 = [System.Environment]::GetFolderPath('Desktop')
 = Get-ChildItem  -Filter '*.lnk'
foreach ( in ) {
   = .CreateShortcut(.FullName)
  Write-Output (.Name + ' | Args: ' + .Arguments + ' | WorkDir: ' + .WorkingDirectory)
}