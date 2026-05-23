Add-Type -AssemblyName System.Drawing

$photoDir = "\\192.168.1.240\Staff\01全員共用\90_写真\春日部クリニック様　施工写真"
$files = Get-ChildItem -Path (Join-Path $photoDir "PK_*.jpg") | Sort-Object Name

if ($files.Count -eq 0) {
    Write-Host "No files found."
    exit
}

Write-Host "Found $($files.Count) files."

$cols = 15
$rows = [Math]::Ceiling($files.Count / $cols)

$thumbW = 120
$thumbH = 90
$spacing = 10

$sheetW = $cols * ($thumbW + $spacing) + $spacing
$sheetH = $rows * ($thumbH + $spacing) + $spacing

$sheet = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
$graphic = [System.Drawing.Graphics]::FromImage($sheet)
$graphic.Clear([System.Drawing.Color]::FromArgb(200, 200, 200))

$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font("Arial", 8)

for ($i = 0; $i -lt $files.Count; $i++) {
    $file = $files[$i]
    $numStr = $file.BaseName.Replace("PK_", "")
    
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        $ratio = [Math]::Min($thumbW / $img.Width, $thumbH / $img.Height)
        $newW = [int]($img.Width * $ratio)
        $newH = [int]($img.Height * $ratio)
        
        $offsetX = [int](($thumbW - $newW) / 2)
        $offsetY = [int](($thumbH - $newH) / 2)
        
        $r = [Math]::Floor($i / $cols)
        $c = $i % $cols
        
        $x = $spacing + $c * ($thumbW + $spacing)
        $y = $spacing + $r * ($thumbH + $spacing)
        
        $graphic.DrawImage($img, ($x + $offsetX), ($y + $offsetY), $newW, $newH)
        $graphic.FillRectangle($bgBrush, $x, $y, 35, 14)
        $graphic.DrawString($numStr, $font, $textBrush, $x, $y)
        
        $img.Dispose()
    } catch {
        Write-Host "Error processing $($file.Name) : $($_.Exception.Message)"
    }
}

$outputDir = "c:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\scratch"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir
}

$outputPath = Join-Path $outputDir "contact_sheet.png"
$sheet.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bgBrush.Dispose()
$textBrush.Dispose()
$font.Dispose()
$graphic.Dispose()
$sheet.Dispose()

Write-Host "Saved contact sheet to $outputPath"
