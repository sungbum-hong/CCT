$s = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$files = Get-ChildItem $desktop -Filter '*.lnk'
foreach ($f in $files) {
  $l = $s.CreateShortcut($f.FullName)
  Write-Output ($f.Name + ' | ' + $l.Arguments + ' | ' + $l.WorkingDirectory)
}