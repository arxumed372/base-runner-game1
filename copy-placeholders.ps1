# Temporary script to create placeholder images
# These are placeholders - replace with actual images later

$workspaceRoot = $PSScriptRoot
$source = Join-Path $workspaceRoot "public\base-runner-game\assets\20251117_2359_BaseRunner Game Title Screen_remix_01ka9sq27aechvm20k8yghfsmj.png"
$dest1 = Join-Path $workspaceRoot "public\icon.png"
$dest2 = Join-Path $workspaceRoot "public\embed.png"
$dest3 = Join-Path $workspaceRoot "public\splash.png"

if (Test-Path $source) {
    Copy-Item $source $dest1 -Force
    Copy-Item $source $dest2 -Force
    Copy-Item $source $dest3 -Force
    Write-Host "Placeholder images created successfully"
} else {
    Write-Host "Source file not found: $source"
    exit 1
}

