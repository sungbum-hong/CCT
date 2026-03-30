$s = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$l = $s.CreateShortcut($desktop + '\코디영.lnk')
Write-Output $l.TargetPath
Write-Output $l.Arguments
